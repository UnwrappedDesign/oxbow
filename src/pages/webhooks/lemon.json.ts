import type { APIRoute } from 'astro';
import { getAuth } from "firebase-admin/auth";
import { app } from "@/firebase/server";
import { verifySignature } from '@/utils/verifySignature';

const secret = import.meta.env.LEMON_SQUEEZE_SECRET;

export const POST: APIRoute = async ({ request }) => {
  const auth = getAuth(app)
  const { headers } = request;
  const signature = headers.get('X-Signature');
  const body = await request.text();

  if (!secret) {
    return new Response('Can not verify signature', { status: 400 });
  }

  if (!signature) {
    return new Response('X-Signature header is required', { status: 400 });
  }
  if (signature && !verifySignature(signature, body, secret)) {
    return new Response('Invalid X-Signature header', { status: 403 });
  }
  try {
    const json = JSON.parse(body);
    const { user_email: email } = json.data.attributes;
    if (!email) {
      return new Response('Email is required', { status: 400 });
    }
    const user = await auth.createUser({
      email,
      displayName: email,
    });
    return new Response(`User created: ${user.uid}`, { status: 200 });
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response('Error creating user', { status: 500 });
  }
};
