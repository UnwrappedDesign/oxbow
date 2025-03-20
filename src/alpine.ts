import type { Alpine } from 'alpinejs'
import outdent from 'outdent';
import ui from '@alpinejs/ui'
import focus from '@alpinejs/focus'
import Clipboard from "@ryangjchandler/alpine-clipboard"
import intersect from '@alpinejs/intersect'
import { auth } from "@/firebase/client";
import { sendSignInLinkToEmail } from "firebase/auth";
import * as amplitude from "@amplitude/analytics-browser";
import { createHighlighter } from 'shiki';
import { createCssVariablesTheme } from 'shiki/core'

const shikiTheme = createCssVariablesTheme({ 
  name: 'css-variables',
  variablePrefix: '--astro-code-',
  variableDefaults: {},
  fontStyle: true
});


export default (Alpine: Alpine) => {
    Alpine.plugin(ui)
    Alpine.plugin(focus)
    Alpine.plugin(Clipboard)
    Alpine.plugin(intersect)

    Alpine.data("navigation", () => ({
        username: "",
        async signOut() {
            await auth.signOut();
            amplitude.reset();
            window.location.assign("/api/auth/signout");
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
        const baseUrl = import.meta.env.PUBLIC_APP_BASE_URL;
        const actionCodeSettings = {
          url: `${baseUrl}/email-signin`,
          handleCodeInApp: true,
        };
        try {
          window.localStorage.setItem("emailForSignIn", this.email);
          await sendSignInLinkToEmail(auth, this.email, actionCodeSettings);
          this.emailSent = true;
        } catch (error) {
          console.log("error", error.code, error.message);
          if (error.code === "auth/admin-restricted-operation") {
            console.log("error auth/admin-restricted-operation");
            this.errorMessage = [
              "We couldn't find an account linked to this email address.",
              "Please check the email address or create a new account.",
            ].join(" ");
          } else {
            console.log("error else");
            this.errorMessage = [
              "We were unable to send the sign-in link to your email.",
              "Please check your email address and try again.",
            ].join(" ");
          }
        }
      },
    }));

    Alpine.data("themeSelector", () => ({
        init() {
          this.$watch('selected', (theme: string) => {
            this.$dispatch('theme', {color: theme.toLowerCase()});
          });
        },  
        colors: [
          { name: 'Blue', color: 'bg-blue-500' },
          { name: 'Red', color: 'bg-red-500' },
          { name: 'Amber', color: 'bg-amber-500' },
          { name: 'Yellow', color: 'bg-yellow-500' },
          { name: 'Lime', color: 'bg-lime-500' },
          { name: 'Green', color: 'bg-green-500' },
          { name: 'Emerald', color: 'bg-emerald-500' },
          { name: 'Teal', color: 'bg-teal-500' },
          { name: 'Cyan', color: 'bg-cyan-500' },
          { name: 'Sky', color: 'bg-sky-500' },
          { name: 'Indigo', color: 'bg-indigo-500' },
          { name: 'Violet', color: 'bg-violet-500' },
          { name: 'Purple', color: 'bg-purple-500' },
          { name: 'Fuchsia', color: 'bg-fuchsia-500' },
          { name: 'Pink', color: 'bg-pink-500' },
          { name: 'Rose', color: 'bg-rose-500' },
          { name: 'Slate', color: 'bg-slate-500' },
          { name: 'Gray', color: 'bg-gray-500' },
          { name: 'Zinc', color: 'bg-zinc-500' },
          { name: 'Neutral', color: 'bg-neutral-500' },
          { name: 'Stone', color: 'bg-stone-500' },
        ],
        selected: 'Blue',
        open: false,
        toggleOpen() {
          this.open = !this.open;
        },
        selectColor(color: string) {
          this.selected = color;
          this.open = false;
        }
    }));

    type Playground = {
        init(): void;
        tab: "preview" | "code" | "theme";
        viewportSize: "desktop" | "tablet" | "mobile";
        code: string;
        copied: boolean;
        theme: string;
        copyCode(): void;
        setTab(tab: Playground["tab"]): void;
        setViewportSize(size: Playground["viewportSize"]): void;
        setCode(code: string): void;
        setTheme(theme: string): void;
    };

    Alpine.data("playground", (): Playground => ({
        init() {
          this.setTheme('blue');
        },
        copied: false,
        tab: "preview",
        viewportSize: "desktop",
        code: "",
        theme: "",
        copyCode() {
          this.copied = true;
          
          switch (this.tab) {
            case 'theme':
              this.$clipboard(this.$refs.theme.innerText);
              break;
            default:
              this.$clipboard(this.$refs.code.innerText);
              break;
          }

          setTimeout(() => {
            this.copied = false;
          }, 2000);
        },  
        setTab(tab: Playground["tab"]) {
          this.tab = tab;
        },
        setViewportSize(size: Playground["viewportSize"]) {
          this.viewportSize = size;
        },
        setCode(code: string) {
          this.code = code;
        },
        async setTheme(themeColor: string) {
          const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
          const variables = shades.map(shade => {
            return `--color-accent-${shade}: var(--color-${themeColor.toLowerCase()}-${shade});`
          });

          shades.forEach(shade => {
            const iframe = document.querySelector('iframe');
            const iframeDocument = iframe?.contentDocument;

            if (iframeDocument) {
              iframeDocument.documentElement.style.setProperty(`--color-accent-${shade}`, `var(--color-${themeColor.toLowerCase()}-${shade})`);
            };
          });

          const css = outdent`
          @theme {
            ${variables.join('\n  ')}
          }`;

          const highlighter = await createHighlighter({
            langs: ['css'],
            themes: [shikiTheme] // register the theme
          });

          this.theme = await highlighter.codeToHtml(css, {
            lang: 'css',
            theme: 'css-variables',
          });
        }
    }));
}