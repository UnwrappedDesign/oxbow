import type { APIRoute } from "astro";


export const GET: APIRoute = async () => {
  return new Response(`ok: ${Date.now()}`, { status: 200 });
};