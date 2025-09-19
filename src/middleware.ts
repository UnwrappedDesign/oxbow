import { defineMiddleware } from "astro/middleware";
// @ts-ignore
// Lazy-load heavy middleware deps to avoid crashes when not installed
let posthtml: any;
let postcss: any;
let postcssRename: any;
// Auth libs are optional in local dev; lazy import inside handler
import { shouldSkipCSSObfuscation } from "@/utils/canSeeCode";

const postcssOptions = {
  from: "/styles/global.css",
  to: "/styles/global.css",
}
const filterType = /^text\/css$/

const mode = import.meta.env.MODE;

// Function to extract excludeFromObfuscation from component files
// Note: Using import.meta.glob({ eager: true }) inside middleware can cause
// module resolution during server start and crash dev if some deps are missing.
// To keep middleware robust, we disable auto-collection and return [] by default.
async function getExcludeClassesFromComponents(): Promise<string[]> {
  return [];
}

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
  } catch (error) {
    // If auth cannot be loaded (missing env or deps), continue without user
    context.locals.user = null;
  }

  // Check if we should skip CSS obfuscation
  const url = new URL(context.request.url);
  const freeComponent = url.searchParams.get('freeComponent') === 'true';
  
  if (shouldSkipCSSObfuscation(context.url.pathname, mode, freeComponent)) {
    return next();
  }

  const response = await next();
  const html = await response.text();

  // Get exclude classes from components
  const excludeClasses = await getExcludeClassesFromComponents();

  let cssMap = {}
  // Dynamically import transformation deps; if missing, skip obfuscation gracefully
  try {
    const [ph, phtop, ren] = await Promise.all([
      import('posthtml'),
      import('posthtml-postcss'),
      import('postcss-rename')
    ]);
    posthtml = (ph as any).default || ph;
    postcss = (phtop as any).default || phtop;
    postcssRename = (ren as any).default || ren;
  } catch (e) {
    console.warn('CSS obfuscation middleware disabled: missing deps', e);
    return new Response(html, response);
  }

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
