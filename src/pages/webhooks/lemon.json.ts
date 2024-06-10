import type { APIRoute } from 'astro';
import { getAuth } from "firebase-admin/auth";
import { createHmac, timingSafeEqual } from "crypto";
import { app } from "../../firebase/server";

const secret = import.meta.env.LEMON_SQUEEZE_SECRET;

function checkSignature(signature: string, payload: string) {
  const hmac = createHmac('sha256', secret);
  const digest = Buffer.from(hmac.update(payload).digest('hex'), 'utf-8');
  const signatureBuffer = Buffer.from(signature, 'utf-8');

  return timingSafeEqual(digest, signatureBuffer);
}


export const POST: APIRoute = async ({ request }) => {
  const auth = getAuth(app)
  const { headers } = request;

  const signature = headers.get('X-Signature');

  if (!signature) {
    return new Response('X-Signature header is required', { status: 400 });
  }

  if (signature && !checkSignature(signature, await request.text())) {
    return new Response('Invalid X-Signature header', { status: 403 });
  }

  try {
    const body = await request.json();

    const { user_email: email } = body.data.attributes;

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
