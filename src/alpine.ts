import type { Alpine } from 'alpinejs'
import ui from '@alpinejs/ui'
import focus from '@alpinejs/focus'
import Clipboard from "@ryangjchandler/alpine-clipboard"
import intersect from '@alpinejs/intersect'
import { auth } from "@/firebase/client";
import { sendSignInLinkToEmail } from "firebase/auth";
import * as amplitude from "@amplitude/analytics-browser";

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
        colors: [
          { name: 'Zinc', color: 'bg-zinc-500' },
          { name: 'Red', color: 'bg-red-500' },
          { name: 'Rose', color: 'bg-rose-500' },
          { name: 'Orange', color: 'bg-orange-500' },
          { name: 'Green', color: 'bg-green-500' },
          { name: 'Blue', color: 'bg-blue-500' },
          { name: 'Yellow', color: 'bg-yellow-500' },
          { name: 'Violet', color: 'bg-violet-500' },
        ],
        selected: 'Zinc',
        open: false,
        toggleOpen() {
          this.open = !this.open;
        },
        selectColor(color: string) {
          this.selected = color;

          [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].forEach(shade => {
            const iframe = document.querySelector('iframe');
            const iframeDocument = iframe?.contentDocument;

            if (iframeDocument) {
              iframeDocument.documentElement.style.setProperty(`--color-accent-${shade}`, `var(--color-${color.toLowerCase()}-${shade})`);
            }
          });
          this.open = false;
        }
    }))
}