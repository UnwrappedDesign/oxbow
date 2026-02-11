import type { Alpine } from "alpinejs";
import outdent from "outdent";
import ui from "@alpinejs/ui";
import focus from "@alpinejs/focus";
import Clipboard from "@ryangjchandler/alpine-clipboard";
import intersect from "@alpinejs/intersect";
import { createHighlighter } from "shiki";
import { createCssVariablesTheme } from "shiki";

const shikiTheme = createCssVariablesTheme({
  name: "css-variables",
  variablePrefix: "--astro-code-",
  variableDefaults: {},
  fontStyle: true,
});

declare global {
  interface Window {
    originalRenderedTheme?: string;
  }
}

export default (Alpine: Alpine) => {
  Alpine.plugin(ui);
  Alpine.plugin(focus);
  Alpine.plugin(Clipboard);
  Alpine.plugin(intersect);

  Alpine.data("navigation", () => ({
    username: "",
    async signOut() {
      window.location.assign("/api/auth/signout");
    },
  }));

  // Selector for base palette (grays) used by components (text-zinc-*, bg-zinc-*)
  Alpine.data("baseThemeSelector", () => ({
    init() {
      this.$watch("selected", (theme: string) => {
        this.$dispatch("baseTheme", { color: theme.toLowerCase() });
      });
      this.loadBaseThemePreference();
    },
    colors: [
      { name: "Slate", color: "bg-slate-500" },
      { name: "Gray", color: "bg-zinc-500" },
      { name: "Zinc", color: "bg-zinc-500" },
      { name: "Neutral", color: "bg-neutral-500" },
      { name: "Stone", color: "bg-stone-500" },
    ],
    selected: "Gray",
    open: false,
    toggleOpen() {
      this.open = !this.open;
    },
    selectColor(color: string) {
      const selectedLower = color.toLowerCase();
      this.selected = color;
      this.open = false;
      this.$dispatch("baseTheme", { color: selectedLower });
      try {
        localStorage.setItem("oxbow_base_theme_color", selectedLower);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        document.cookie = `oxbow_base_theme_color=${selectedLower}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
      } catch {}
      document
        .querySelectorAll('[x-data="playground"]')
        .forEach((playground) => {
          playground.dispatchEvent(
            new CustomEvent("baseTheme", { detail: { color: selectedLower } }),
          );
        });
    },
    async loadBaseThemePreference() {
      let theme = "gray";
      try {
        const local = localStorage.getItem("oxbow_base_theme_color");
        if (local) theme = local;
      } catch {}
      this.selected = theme.charAt(0).toUpperCase() + theme.slice(1);
      setTimeout(() => {
        document
          .querySelectorAll('[x-data="playground"]')
          .forEach((playground) => {
            playground.dispatchEvent(
              new CustomEvent("baseTheme", { detail: { color: theme } }),
            );
          });
      }, 100);
    },
  }));

  Alpine.data("loginForm", () => ({
    email: "",
    emailSent: false,
    errorMessage: "",
    clearErrorMessage() {
      this.errorMessage = "";
    },
    clearForm() {
      this.email = "";
      this.emailSent = false;
      this.errorMessage = "";
    },
    async sendEmail() {
      // Login functionality removed
      this.errorMessage = "Authentication is no longer available.";
    },
  }));

  Alpine.data("themeSelector", () => ({
    init() {
      this.$watch("selected", (theme: string) => {
        this.$dispatch("theme", { color: theme.toLowerCase() });
        // Don't call saveThemePreference here to avoid duplicate calls
        // It will be called by selectColor
      });

      // Initialize with user's saved preference if authenticated
      this.loadUserThemePreference();
    },
    colors: [
      { name: "Blue", color: "bg-blue-500" },
      { name: "Red", color: "bg-red-500" },
      { name: "Amber", color: "bg-amber-500" },
      { name: "Yellow", color: "bg-yellow-500" },
      { name: "Lime", color: "bg-lime-500" },
      { name: "Green", color: "bg-green-500" },
      { name: "Emerald", color: "bg-emerald-500" },
      { name: "Teal", color: "bg-teal-500" },
      { name: "Cyan", color: "bg-cyan-500" },
      { name: "Sky", color: "bg-sky-500" },
      { name: "Indigo", color: "bg-indigo-500" },
      { name: "Violet", color: "bg-violet-500" },
      { name: "Purple", color: "bg-purple-500" },
      { name: "Fuchsia", color: "bg-fuchsia-500" },
      { name: "Pink", color: "bg-pink-500" },
      { name: "Rose", color: "bg-rose-500" },
    ],
    selected: "Blue",
    open: false,
    toggleOpen() {
      this.open = !this.open;
    },
    selectColor(color: string) {
      console.log(`Selecting color: ${color}`);

      // Store previous selection to check if there was an actual change
      const prevSelected = this.selected;

      // Get the original server-rendered theme for comparison
      const originalTheme = window.originalRenderedTheme || "blue";
      const selectedColorLower = color.toLowerCase();

      // Update selected color
      this.selected = color;
      this.open = false;

      // Dispatch theme event immediately to update the preview
      this.$dispatch("theme", { color: selectedColorLower });

      // Store the selected color in localStorage and cookies as fallbacks
      try {
        // Store in localStorage
        localStorage.setItem("oxbow_theme_color", selectedColorLower);

        // Store timestamp of change to detect recent changes
        localStorage.setItem(
          "oxbow_theme_changed_at",
          new Date().getTime().toString(),
        );

        // Store the current theme to check if different from server-rendered
        localStorage.setItem("oxbow_current_theme", selectedColorLower);

        // Store in cookie (30 day expiry)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        document.cookie = `oxbow_theme_color=${selectedColorLower}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;

        console.log(`Saved theme color to storage: ${selectedColorLower}`);
      } catch (error) {
        console.error("Error saving theme to storage:", error);
      }

      // Also dispatch event directly to playground components to ensure they update
      document
        .querySelectorAll('[x-data="playground"]')
        .forEach((playground) => {
          playground.dispatchEvent(
            new CustomEvent("theme", {
              detail: { color: selectedColorLower },
            }),
          );
        });

      // Only refresh if the color actually changed (not just clicking the same color)
      if (prevSelected.toLowerCase() !== selectedColorLower) {
        // If the new color is different from the originally rendered color
        if (selectedColorLower !== originalTheme) {
          // Find the current active tab in the playground

          const urlParams = new URLSearchParams(window.location.search);
          const tabParam = urlParams.get("tab");
          const currentTab = tabParam ?? "preview";

          // Only refresh if we're viewing the 'code' tab
          if (currentTab === "code") {
            console.log(
              'Currently on "code" tab and theme differs from server-rendered - refreshing page',
            );
            this.refreshPageWithCurrentTab(color);
          } else {
            console.log('Not on "code" tab - no immediate refresh needed');
          }
        } else {
          console.log(
            "Selected theme matches server-rendered theme - no refresh needed",
          );
        }
      } else {
        console.log("Same color selected - no need to refresh");
      }
    },
    refreshPageWithCurrentTab(color: string) {
      console.log(`refreshPageWithCurrentTab called with color: ${color}`);

      // Create URL preserving existing parameters
      const url = new URL(window.location.href);

      // Preserve the existing tab parameter if present
      // If not already in the URL, get it from the playground component
      if (!url.searchParams.has("tab")) {
        const playground = document.querySelector('[x-data="playground"]');
        let currentTab = "preview";

        try {
          if (
            playground &&
            (playground as any).__x &&
            (playground as any).__x.$data
          ) {
            currentTab = (playground as any).__x.$data.tab || "preview";
            console.log(`Current tab from component: ${currentTab}`);
            url.searchParams.set("tab", currentTab);
          }
        } catch (error) {
          console.error("Error getting current tab:", error);
        }
      } else {
        console.log(
          `Preserving existing tab parameter: ${url.searchParams.get("tab")}`,
        );
      }

      // Remove any existing theme parameter if present
      url.searchParams.delete("theme");

      console.log(`Navigating to URL: ${url.toString()}`);

      // Use a more direct approach to ensure the page refreshes
      try {
        // Set URL first
        window.history.replaceState({}, "", url.toString());
        // Then force reload
        setTimeout(() => {
          window.location.reload();
        }, 200);
      } catch (error) {
        console.error("Error refreshing page:", error);
        // Fallback to simple redirect
        window.location.href = url.toString();
      }
    },
    async loadUserThemePreference() {
      // Load from localStorage only (no Firebase)
      let themeLoaded = false;
      let loadedTheme = "blue";

      // Fallback to localStorage
      if (!themeLoaded) {
        try {
          const localTheme = localStorage.getItem("oxbow_theme_color");
          if (localTheme) {
            this.selected =
              localTheme.charAt(0).toUpperCase() + localTheme.slice(1);
            loadedTheme = localTheme.toLowerCase();
            themeLoaded = true;
          }
        } catch (error) {
          console.error("Error reading from localStorage:", error);
        }
      }

      // Finally check cookies as last resort
      if (!themeLoaded) {
        try {
          const cookies = document.cookie.split(";");
          const themeCookie = cookies.find((cookie) =>
            cookie.trim().startsWith("oxbow_theme_color="),
          );
          if (themeCookie) {
            const themeValue = themeCookie.split("=")[1].trim();
            console.log(`Found theme in cookies: ${themeValue}`);
            this.selected =
              themeValue.charAt(0).toUpperCase() + themeValue.slice(1);
            loadedTheme = themeValue.toLowerCase();
            themeLoaded = true;
          }
        } catch (error) {
          console.error("Error reading from cookies:", error);
        }
      }

      // If nothing found, use default (Blue)
      if (!themeLoaded) {
        loadedTheme = "blue";
        this.selected = "Blue";
      }

      // Dispatch theme event to trigger setTheme on playground
      console.log(`Dispatching theme event with color: ${loadedTheme}`);
      setTimeout(() => {
        document
          .querySelectorAll('[x-data="playground"]')
          .forEach((playground) => {
            playground.dispatchEvent(
              new CustomEvent("theme", {
                detail: { color: loadedTheme },
              }),
            );
          });
      }, 100); // Small delay to ensure Alpine has initialized the playground component
    },
  }));

  type Playground = {
    init(): void;
    tab: "preview" | "code" | "theme";
    viewportSize: "desktop" | "tablet" | "mobile";
    code: string;
    copied: boolean;
    theme: string;
    mode: "light" | "system" | "dark";
    copyCode(): void;
    setTab(tab: Playground["tab"]): void;
    setViewportSize(size: Playground["viewportSize"]): void;
    setCode(code: string): void;
    setTheme(theme: string): void;
    setColorMode(mode: "light" | "system" | "dark"): void;
    stripDarkClasses(s: string): string;
  };

  Alpine.data(
    "playground",
    (): Playground => ({
      init() {
        console.log("Playground init");

        // Listen for theme events
        this.$el.addEventListener("theme", (event: CustomEvent) => {
          if (event.detail && event.detail.color) {
            console.log(
              `Theme event received with color: ${event.detail.color}`,
            );
            this.setTheme(event.detail.color);
          }
        });
        // Listen for base (gray) palette changes
        this.$el.addEventListener("baseTheme", (event: CustomEvent) => {
          if (event.detail && event.detail.color) {
            this.setBaseTheme(event.detail.color);
          }
        });

        // Check URL parameters for tab preference
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const tabParam = urlParams.get("tab");

          // Set the tab based on URL parameter if valid
          if (tabParam) {
            console.log(`Setting initial tab from URL: ${tabParam}`);
            if (["preview", "code"].includes(tabParam)) {
              this.tab = tabParam as Playground["tab"];
            } else {
              console.log(`Invalid tab parameter: ${tabParam}`);
            }
          } else {
            console.log("No tab parameter in URL");
          }
        } catch (error) {
          console.error("Error setting initial tab:", error);
        }

        // Ensure the iframe gets an initial color mode application
        try {
          setTimeout(() => {
            this.setColorMode(this.mode);
          }, 0);
        } catch {}

        // Theme will be set by the script in Playground.astro
        // using the user's saved preference from custom claims
      },
      copied: false,
      tab: "preview",
      viewportSize: "desktop",
      code: "",
      theme: "",
      mode: "system",
      copyCode() {
        this.copied = true;
        let text = "";
        if (this.tab === "theme") {
          text = this.$refs.theme?.innerText || "";
        } else {
          const el =
            this.mode === "light"
              ? this.$refs.codeLight
              : this.mode === "dark"
                ? this.$refs.codeDarkOnly
                : this.$refs.codeSystem;
          text = el?.innerText || "";
        }
        try {
          if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(text);
          } else if (typeof this.$clipboard === "function") {
            this.$clipboard(text);
          } else {
            const ta = document.createElement("textarea");
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            ta.remove();
          }
        } catch (e) {
          try {
            const ta = document.createElement("textarea");
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            ta.remove();
          } catch {}
        }

        setTimeout(() => {
          this.copied = false;
        }, 2000);
      },
      setTab(tab: Playground["tab"]) {
        // Store previous tab
        const prevTab = this.tab;

        // Update tab
        this.tab = tab;

        // Update URL to reflect the current tab without page refresh
        try {
          const url = new URL(window.location.href);
          url.searchParams.set("tab", tab);
          console.log(`Updating URL to: ${url.toString()}`);
          window.history.replaceState({}, "", url.toString());
        } catch (error) {
          console.error("Error updating URL with tab:", error);
        }

        const originalTheme = window.originalRenderedTheme || "blue";

        if (tab === "preview") {
          console.log("Setting theme to preview");

          setTimeout(() => {
            this.setTheme(originalTheme);
            try {
              const iframe = (this as any).$el.querySelector("iframe");
              iframe?.contentWindow?.postMessage(
                { type: "oxbow-request-height" },
                "*",
              );
              setTimeout(
                () =>
                  iframe?.contentWindow?.postMessage(
                    { type: "oxbow-request-height" },
                    "*",
                  ),
                200,
              );
            } catch {}
          }, 400);
        }

        // No reload on switching to code tab; render client-side smoothly
      },
      setViewportSize(size: Playground["viewportSize"]) {
        this.viewportSize = size;
      },
      setCode(code: string) {
        this.code = code;
      },
      async setTheme(themeColor: string) {
        const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
        const variables = shades.map((shade) => {
          return `--color-accent-${shade}: var(--color-${themeColor.toLowerCase()}-${shade});`;
        });

        const rootEl = (this as any).$el as HTMLElement;
        const iframe = (rootEl &&
          rootEl.querySelector("iframe")) as HTMLIFrameElement | null;
        const iframeDocument =
          iframe?.contentDocument || iframe?.contentWindow?.document || null;
        if (iframeDocument) {
          const rootVars = getComputedStyle(document.documentElement);
          const palette = themeColor.toLowerCase();
          shades.forEach((shade) => {
            const token = rootVars
              .getPropertyValue(`--color-${palette}-${shade}`)
              .trim();
            const value = token || `var(--color-${palette}-${shade})`;
            iframeDocument.documentElement.style.setProperty(
              `--color-accent-${shade}`,
              value,
            );
          });
        }

        const css = outdent`
          @theme {
            ${variables.join("\n  ")}
          }`;

        const highlighter = await createHighlighter({
          langs: ["css"],
          themes: [shikiTheme], // register the theme
        });

        this.theme = await highlighter.codeToHtml(css, {
          lang: "css",
          theme: "css-variables",
        });
      },
      setColorMode(mode: "light" | "system" | "dark") {
        this.mode = mode;
        const apply = (prefersDark?: boolean) => {
          try {
            const iframe = (this as any).$el.querySelector(
              "iframe",
            ) as HTMLIFrameElement | null;
            const doc =
              iframe?.contentDocument || iframe?.contentWindow?.document;
            const html = doc?.documentElement;
            const body = doc?.body;
            if (!html) return;
            const enableDark =
              mode === "dark" || (mode === "system" && !!prefersDark);
            html.classList.toggle("dark", enableDark);
            body?.classList.toggle("dark", enableDark);
            try {
              if (enableDark) {
                html.setAttribute("data-theme", "dark");
                body?.setAttribute("data-theme", "dark");
              } else {
                html.removeAttribute("data-theme");
                body?.removeAttribute("data-theme");
              }
            } catch {}
            // Also notify the iframe so it can self-apply even if DOM not yet reachable
            try {
              iframe?.contentWindow?.postMessage(
                { type: "oxbow-set-dark", enable: enableDark },
                "*",
              );
            } catch {}
            // Nudge height in case layout changes
            setTimeout(() => {
              try {
                iframe?.contentWindow?.postMessage(
                  { type: "oxbow-request-height" },
                  "*",
                );
              } catch {}
            }, 50);
            setTimeout(() => {
              try {
                iframe?.contentWindow?.postMessage(
                  { type: "oxbow-request-height" },
                  "*",
                );
              } catch {}
            }, 250);
          } catch {}
        };
        try {
          if (mode === "system") {
            const mq = window.matchMedia("(prefers-color-scheme: dark)");
            // Save ref so we can remove when leaving system
            (this as any)._mq &&
              mq.removeEventListener("change", (this as any)._mq);
            const listener = (e: MediaQueryListEvent) => apply(e.matches);
            (this as any)._mq = listener;
            mq.addEventListener("change", listener);
            apply(mq.matches);
          } else {
            // Leaving system mode: detach previous listener if any
            const mq = window.matchMedia("(prefers-color-scheme: dark)");
            if ((this as any)._mq) {
              mq.removeEventListener("change", (this as any)._mq);
              (this as any)._mq = null;
            }
            apply(mode === "dark");
          }
        } catch {
          apply(mode === "dark");
        }
      },
      stripDarkClasses(s: string): string {
        try {
          // Remove Tailwind dark: prefixed classes across the code text
          let out = s.replace(/(^|\s)dark:[^\s"'>]+/g, " ");
          // Tidy up excessive spaces on lines
          out = out.replace(/\t+/g, "  ");
          out = out.replace(/ +/g, " ");
          return out;
        } catch {
          return s;
        }
      },
      setBaseTheme(baseColor: string) {
        const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
        const palette = baseColor.toLowerCase();
        const rootEl = (this as any).$el as HTMLElement;
        const iframe = (rootEl &&
          rootEl.querySelector("iframe")) as HTMLIFrameElement | null;
        const iframeDocument =
          iframe?.contentDocument || iframe?.contentWindow?.document || null;
        if (iframeDocument) {
          const rootVars = getComputedStyle(document.documentElement);
          shades.forEach((shade) => {
            const token = rootVars
              .getPropertyValue(`--color-${palette}-${shade}`)
              .trim();
            const value = token || `var(--color-${palette}-${shade})`;
            iframeDocument.documentElement.style.setProperty(
              `--color-zinc-${shade}`,
              value,
            );
          });
        }
      },
    }),
  );
};
