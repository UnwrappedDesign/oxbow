import { defineMiddleware } from "astro/middleware";
// @ts-ignore
import postcss from 'posthtml-postcss'
import postcssRename from 'postcss-rename'
import posthtml from "posthtml";
import { getAuth } from "firebase-admin/auth";
import { app } from "@/firebase/server";
import { shouldSkipCSSObfuscation } from "@/utils/canSeeCode";

const postcssOptions = {
  from: "/styles/global.css",
  to: "/styles/global.css",
}
const filterType = /^text\/css$/

const mode = import.meta.env.MODE;

// Function to extract excludeFromObfuscation from component files
async function getExcludeClassesFromComponents(): Promise<string[]> {
  const excludeClasses: string[] = [];
  
  try {
    // Import all component files that might have excludeFromObfuscation
    const componentModules = import.meta.glob('/src/components/**/*.astro', { eager: true });
    
    for (const [path, module] of Object.entries(componentModules)) {
      if (module && typeof module === 'object' && 'excludeFromObfuscation' in module) {
        const componentExcludes = (module as any).excludeFromObfuscation;
        if (Array.isArray(componentExcludes)) {
          excludeClasses.push(...componentExcludes);
        }
      }
    }
  } catch (error) {
    console.warn('Failed to load component excludeFromObfuscation:', error);
  }
  
  // Remove duplicates
  return [...new Set(excludeClasses)];
}

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

  // Get exclude classes from components
  const excludeClasses = await getExcludeClassesFromComponents();

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
