import type { APIRoute } from 'astro';
import { getAuth } from "firebase-admin/auth";
import { app } from "../../firebase/server";

export const POST: APIRoute = async ({ request }) => {
  const auth = getAuth(app)
  const { headers } = request;

  if (!headers.get('X-Signature')) {
    return new Response('X-Signature header is required', { status: 400 });
  }

  if (headers.get('X-Signature') !== import.meta.env.LEMON_SQUEEZE_SECRET) {
    return new Response('Invalid X-Signature header', { status: 403 });
  }

  try {
    const body = await request.json();

    const { email, displayName } = body;

    if (!email) {
      return new Response('Email is required', { status: 400 });
    }

    const user = await auth.createUser({
      email,
      displayName,
    });

    return new Response(`User created: ${user.uid}`, { status: 200 });
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response('Error creating user', { status: 500 });
  }
};
