import { defineMiddleware } from "astro/middleware";
import { getAstroPostHTML } from "astro-posthtml";
import _minifyClassnames from "posthtml-minify-classnames";

const excludeClasses = [
  // Text classes
  "text-white",
  "text-accent-600",
  "text-accent-500",
  // Background classes
  "bg-white",
  "bg-base-100",
  "bg-base-50",
  // Border classes
  "border-b-2",
  "border-accent-500",
  // Hover classes
  "hover:shadow-none",
  "hover:to-accent-800",
  "hover:text-accent-500",
  // Focus classes
  "focus:ring-2",
  "focus:ring-accent-950",
  "focus:ring-offset-2",
  // Ring
  "ring-offset-base-200",
  // Shadow
  "shadow",
  // Visibility
  "hidden",
  "opacity-0",
  "opacity-25",
  "opacity-100",
  // Displau classes
  "inline-flex",
  "flex",
  "transition-all",
  "duration-200",
  "translate-y-1",
  "translate-y-0",
  "translate-x-full",
  "translate-x-0",

  // Gradients
  "bg-gradient-to-b",
  "from-accent-500",
  "to-accent-600",
  // Size
  "size-12",
  "w-1/2 ",

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
