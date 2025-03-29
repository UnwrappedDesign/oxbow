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

    Alpine.store('themeConfig', {
      init() {
        this.color = localStorage.getItem('color') || 'blue';
        this.theme = localStorage.getItem('theme') === 'true';
      },
      setColor(color: string) {
        this.color = color; 
        localStorage.setItem('color', color);
      },
      setTheme(theme: boolean) {
        this.theme = theme;
        localStorage.setItem('theme', theme.toString());
      }
    });

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
          this.useTheme = Alpine.store('themeConfig').theme;
          this.selected = Alpine.store('themeConfig').color;

          this.$watch('selected', (theme: string) => {
            Alpine.store('themeConfig').setColor(theme);
            this.$dispatch('theme-change', {
              color: theme,
              theme: this.useTheme
            });
          });

          this.$watch('useTheme', (useTheme: boolean) => {
            Alpine.store('themeConfig').setTheme(useTheme);
            this.$dispatch('theme-change', {
              color: this.selected,
              theme: useTheme
            });

            // update the theme in the url
            const url = new URL(window.location.href);
            url.searchParams.set('theme', !useTheme ? this.selected : '');
            window.location.href = url.toString();
          });

          this.$dispatch('theme-change', {
            color: this.selected,
            theme: this.useTheme
          });
        },  
        useTheme: false,
        colors: [
          'blue',
          'red',
          'amber',
          'yellow',
          'lime',
          'green',
          'emerald',
          'teal',
          'cyan',
          'sky',
          'indigo',
          'violet',
          'purple',
          'fuchsia',
          'pink',
          'rose',
          'slate',
          'gray',
          'zinc',
          'neutral',
          'stone',
        ],
        selected: 'blue',
        open: false,
        toggleOpen() {
          this.open = !this.open;
        },
        selectColor(color: string) {
          this.selected = color;
          this.open = false;
        },
        setUseTheme(useTheme: boolean) {
          this.useTheme = useTheme;
        }
    }));

    type Playground = {
        init(): void;
        tab: "preview" | "code" | "theme";
        viewportSize: "desktop" | "tablet" | "mobile";
        code: string;
        copied: boolean;
        theme: string;
        useTheme: boolean;
        copyCode(): void;
        setTab(tab: Playground["tab"]): void;
        setViewportSize(size: Playground["viewportSize"]): void;
        setCode(code: string): void;
        setTheme({color, theme}: {color: string, theme: boolean}): void;
    };

    Alpine.data("playground", (): Playground => ({
        async init() {
          this.highlighter = await createHighlighter({
            langs: ['css'],
            themes: [shikiTheme] // register the theme
          });

          setTimeout(() => {
            this.setTheme({
              color: Alpine.store('themeConfig').color,
              theme: Alpine.store('themeConfig').theme
            });
          }, 500);

          this.$watch('useTheme', (useTheme: boolean) => {
            if (!useTheme && this.tab === 'theme') {
              this.setTab('preview');
            }
          });
        },
        copied: false,
        tab: "preview",
        viewportSize: "desktop",
        code: "",
        theme: "",
        useTheme: false,
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
        async setTheme({color, theme}: {color: string, theme: boolean}) {
          const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
          const variables = shades.map(shade => {
            return `--color-accent-${shade}: var(--color-${color.toLowerCase()}-${shade});`
          });

          shades.forEach(shade => {
            const iframe = document.querySelector('iframe');
            const iframeDocument = iframe?.contentDocument;

            if (iframeDocument) {
              iframeDocument.documentElement.style.setProperty(`--color-accent-${shade}`, `var(--color-${color.toLowerCase()}-${shade})`);
            };
          });

          const css = outdent`
          @theme {
            ${variables.join('\n  ')}
          }`;

          this.theme = await this.highlighter.codeToHtml(css, {
            lang: 'css',
            theme: 'css-variables',
          });
          this.useTheme = theme;
        }
    }));
}