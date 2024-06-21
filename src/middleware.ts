import { defineMiddleware } from "astro/middleware";
import { getAstroPostHTML } from "astro-posthtml"
import _minifyClassnames from "posthtml-minify-classnames"

const minifyClassnames = _minifyClassnames({
  filter: /^(.border-transparent|.border-blue-500|.bg-white|.bg-black\/5|.bg-black\/0|.hidden)$/,
  genNameId: false,
  customAttributes: [
    'x-transition:enter',
    'x-transition:enter-start',
    'x-transition:enter-end',
    'x-transition:leave',
    'x-transition:leave-start',
    'x-transition:leave-end',
  ]
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
        context.locals.user = await auth.getUser(decodedCookie.uid);
        return next();
      }
    } else {
      context.locals.user = null;
    }
    // forward request
  } catch (error) {}

  if (mode === "development") {
    return next();
  }
  return getAstroPostHTML([minifyClassnames])(context, next)
 ;
});