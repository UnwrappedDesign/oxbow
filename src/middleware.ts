import { defineMiddleware } from "astro/middleware";
import { getAstroPostHTML } from "astro-posthtml"
import _minifyClassnames from "posthtml-minify-classnames"

const minifyClassnames = _minifyClassnames({
  genNameId: false
});

import { getAuth } from "firebase-admin/auth";
import { app } from "./firebase/server";

const mode = import.meta.env.MODE;

export const onRequest = defineMiddleware(async (context, next) => {

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

  if (mode === "development") {
    return next();
  }
  return getAstroPostHTML([minifyClassnames])(context, next)
 ;
});