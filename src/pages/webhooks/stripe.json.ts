import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { getAuth } from "firebase-admin/auth";
import { app } from "@/firebase/server";
import { sendMagicLink } from '@/email/sendMagicLink';

const stripeId = import.meta.env.STRIPE_API_KEY;
const secret = import.meta.env.STRIPE_SECRET;
const baseUrl = import.meta.env.PUBLIC_APP_BASE_URL;

const stripe = new Stripe(stripeId);

export const POST: APIRoute = async ({ request }) => {
  const auth = getAuth(app)
  const { headers } = request;
  const signature = headers.get('stripe-signature');
  const body = await request.text();

  if (!secret) {
    return new Response('Can not verify signature', { status: 400 });
  }

  if (!signature) {
    return new Response('stripe-signature header is required', { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, secret) as Stripe.CheckoutSessionCompletedEvent;

    if (event.type !== 'checkout.session.completed') {
      return new Response('Event not supported', { status: 200 });
    }

    const customer = event.data.object;

    const { email } = customer.customer_details;

    if (!email) {
      return new Response('Email is required', { status: 400 });
    }

    const user = await auth.createUser({
      email,
      displayName: email,
    });

    const actionCodeSettings = {
      url: `${baseUrl}/email-signin`,
      handleCodeInApp: true,
    };

    auth.generateSignInWithEmailLink(email, actionCodeSettings)
      .then(link => {
        sendMagicLink(email, link);
      });

    return new Response(`User created: ${user.uid}`, { status: 200 });
  } catch (error) {
    return new Response(`Webhook error: ${error.message}`, { status: 500 });
  }
}
