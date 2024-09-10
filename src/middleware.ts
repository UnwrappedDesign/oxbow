import { defineMiddleware } from "astro/middleware";
import { getAstroPostHTML } from "astro-posthtml";
import _minifyClassnames from "posthtml-minify-classnames";

const excludeClasses = [
  "bg-white",
  "hidden",
  "inline-flex",
  "flex",
  "text-blue-500",
  "border-b-2",
  "border-blue-500",
  "text-white",
  "bg-gradient-to-b",
  "from-blue-500",
  "to-indigo-600",
  "hover:shadow-none",
  "shadow",
  "transition-all",
  "duration-200",
  "focus:ring-2",
  "focus:ring-blue-950",
  "focus:ring-offset-2",
  "ring-offset-gray-200",
  "hover:to-indigo-800",
  "opacity-0",
  "opacity-100",
  "translate-y-1",
  "translate-y-0",
];

const minifyClassnames = _minifyClassnames({
  genNameId: false,
  filter: new RegExp(`^\.(${excludeClasses.join("|")})$`),
  customAttributes: [
    "x-transition:enter",
    "x-transition:enter-start",
    "x-transition:enter-end",
    "x-transition:leave",
    "x-transition:leave-start",
    "x-transition:leave-end",
  ],
});

import { getAuth } from "firebase-admin/auth";
import { app } from "@/firebase/server";

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

  if (
    /^\/iframe\/.*(01).astro$/.test(context.url.pathname) ||
    !context.url.pathname.startsWith(`/iframe/`) ||
    mode === "development"
  ) {
    return next();
  }

  return getAstroPostHTML([minifyClassnames])(context, next);
});
