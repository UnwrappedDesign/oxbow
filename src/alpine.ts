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
}