import type { APIRoute } from 'astro';
import { getAuth } from "firebase-admin/auth";
import { app } from "@/firebase/server";
import { Webhook } from "standardwebhooks";

const secret = import.meta.env.POLAR_SECRET;

export const POST: APIRoute = async ({ request }) => {
  const auth = getAuth(app)
  const { headers } = request;
  const signature = headers.get('webhook-signature');
  const body = await request.text();

  if (!secret) {
    return new Response('Can not verify signature', { status: 400 });
  }

  if (!signature) {
    return new Response('webhook-signature header is required', { status: 400 });
  }

  const webhookSecret = Buffer.from(secret).toString(
		"base64",
	);

  const wh = new Webhook(webhookSecret);

  const webhookHeaders = {
		"webhook-id": headers.get("webhook-id") ?? "",
		"webhook-timestamp": headers.get("webhook-timestamp") ?? "",
		"webhook-signature": headers.get("webhook-signature") ?? "",
	};

  if (signature && !wh.verify(body, webhookHeaders)) {
    return new Response('Invalid webhook-signature header', { status: 403 });
  }

  try {
    const json = JSON.parse(body);
    const { email } = json.data.user;
    
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
