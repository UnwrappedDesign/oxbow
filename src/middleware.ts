import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.isPrerendered) {
    return next();
  }

  try {
    if (context.cookies.has("__session")) {
      const [{ getAuth }, { app }] = await Promise.all([
        import("firebase-admin/auth"),
        import("@/firebase/server"),
      ]);
      const auth = getAuth(app as any);
      const sessionCookie = context.cookies.get("__session")?.value;
      if (sessionCookie) {
        const decodedCookie = await auth.verifySessionCookie(sessionCookie);
        if (decodedCookie) {
          context.locals.user = await auth.getUser(decodedCookie.uid);
          return next();
        }
      }
    } else {
      context.locals.user = null;
    }
  } catch {
    // If auth cannot be loaded (missing env or deps), continue without user
    context.locals.user = null;
  }

  // Since everything is now free and open, skip CSS obfuscation
  // No need to protect code anymore
  return next();
});
