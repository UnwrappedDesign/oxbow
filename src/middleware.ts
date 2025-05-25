import { defineMiddleware } from "astro/middleware";
// @ts-ignore
import postcss from 'posthtml-postcss'
import postcssRename from 'postcss-rename'
import posthtml from "posthtml";
import { getAuth } from "firebase-admin/auth";
import { app } from "@/firebase/server";
import { shouldSkipCSSObfuscation } from "@/utils/canSeeCode";

const excludeClasses = [
  // Text classes
  "text-white",
  "text-accent-600",
  "text-accent-500",
  "text-base-400",
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
  "hover:text-accent-400",
  // Focus classes
  "focus:ring-2",
  "focus:ring-base-950",
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
  "flex",
  "inset-0",
  "absolute",
  "inline-flex",
  // Transition classes
  "ease-in-out",
  "transition-all",
  "transition-transform",
  // Transform classes
  "translate-y-1",
  "translate-y-0",
  "translate-x-full",
  "translate-x-0",
  // Furation
  "duration-200",
  // Gradients
  "bg-gradient-to-b",
  "from-accent-500",
  "to-accent-600",
  // Size
  "size-12",
  "w-1/2",
];

const postcssOptions = {
  from: "/styles/global.css",
  to: "/styles/global.css",
}
const filterType = /^text\/css$/

const mode = import.meta.env.MODE;

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.isPrerendered) {
    return next();
  }

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

  // Check if we should skip CSS obfuscation
  const url = new URL(context.request.url);
  const freeComponent = url.searchParams.get('freeComponent') === 'true';
  
  if (shouldSkipCSSObfuscation(context.url.pathname, mode, freeComponent)) {
    return next();
  }

  const response = await next();
  const html = await response.text();

  let cssMap = {}
  const postcssPLugins = [postcssRename({
    strategy: "minimal",
    except: excludeClasses,
    outputMapCallback: (map) => {
      cssMap = {
        ...cssMap,
        ...map
      }
      return map
    }
  })]

  const result = await posthtml()
    .use(postcss(postcssPLugins, postcssOptions, filterType))
    .use(tree => {
      tree.walk(node => {
        if (node.attrs) {
          const classes = node.attrs.class ? node.attrs.class.split(" ") : []
          node.attrs.class = classes.map(className => {
            if (excludeClasses.includes(className)) {
              return className
            }
            if (cssMap[className]) {
              return cssMap[className]
            }
            return className
          }).join(" ")
        }
        return node
      })
      return tree
    })
    .process(html);

  return new Response(result.html, response);
});
