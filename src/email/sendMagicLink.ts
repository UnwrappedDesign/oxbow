import { Resend } from 'resend';
import dedent from 'dedent';

const resendApiKey = import.meta.env.RESEND_API_KEY;

const getTemplate = (email: string, link: string) => {
  const date = new Date().toUTCString();
  
  return dedent`
    Hello,

    We received a request to sign in to Oxbow UI using this email address, at ${date}.
    If you want to sign in with your ${email} account, click this link:
      
    <a href="${link}">Sign in to Oxbow UI</a>

    If you did not request this link, you can safely ignore this email.

    Thanks,

    Your Oxbow UI team
  `;
};

const resend = new Resend(resendApiKey);

export const sendMagicLink = (email: string, link: string) => {
  return resend.emails.send({
    from: 'Oxbow UI <noreply@oxbowui.com>',
    to: email,
    subject: 'Sign in to Oxbow UI',
    html: getTemplate(email, link),
  });
};