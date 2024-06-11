import { defineMiddleware } from "astro/middleware";

import { getAuth } from "firebase-admin/auth";
import { app } from "./firebase/server";

const protectedRoutes = [
  "/blog-content/",
  "/blog-entries/",
  "/centered-headings/",
  "/centered-heroes/",
  "/faq/",
  "/features/",
  "/grids/",
  "/left-headings/",
  "/left-heroes/",
  "/pricing/",
  "/right-headings/",
  "/right-heroes/",
  "/team/",
];

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;

  if (protectedRoutes.every(route => !pathname.startsWith(route))){
    return next();
  }

  try {
    if (context.cookies.has("__session")) {
      const auth = getAuth(app);
      const sessionCookie = context.cookies.get("__session").value;
      const decodedCookie = await auth.verifySessionCookie(sessionCookie);
      if (decodedCookie) {
        return next();
      }
    }
    // forward request
  } catch (error) {}
  return Response.redirect(new URL("/pricing", context.url), 302);
});