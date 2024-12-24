import type { APIRoute } from 'astro';
import { getAuth } from "firebase-admin/auth";
import { app } from "@/firebase/server";
import Stripe from 'stripe';

const stripeId = import.meta.env.STRIPE_ID;
const secret = import.meta.env.STRIPE_SECRET;

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
    const event = stripe.webhooks.constructEvent(body, signature, secret) as Stripe.CheckoutSessionAsyncPaymentSucceededEvent;

    if (event.type !== 'checkout.session.async_payment_succeeded') {
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

    return new Response(`User created: ${user.uid}`, { status: 200 });
  } catch (error) {
    return new Response(`Webhook error: ${error.message}`, { status: 500 });
  }
}
