import { env } from "../../config/env";

function accountSetupUrl(token: string): string {
  const baseUrl =
    env.ACCOUNT_SETUP_URL ||
    `${env.CORS_ORIGIN.replace(/\/$/, "")}/set-password`;
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}token=${encodeURIComponent(token)}`;
}

export async function sendEnrollmentApprovedEmail(input: {
  email: string;
  firstName: string;
  studentId: string;
  setupToken: string | null;
}): Promise<void> {
  if (!env.SENDGRID_API_KEY || !env.MAIL_DEFAULT_FROM) {
    throw new Error(
      "SendGrid is not configured; set SENDGRID_API_KEY and MAIL_DEFAULT_FROM",
    );
  }

  const setupMessage = input.setupToken
    ? `Set your password within 24 hours using this one-time link: ${accountSetupUrl(input.setupToken)}`
    : "You can sign in using your existing account credentials.";
  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: input.email }] }],
      from: { email: env.MAIL_DEFAULT_FROM },
      subject: "Your enrollment has been approved",
      content: [
        {
          type: "text/plain",
          value: `Hello ${input.firstName},\n\nYour enrollment has been approved.\nStudent ID: ${input.studentId}\n\n${setupMessage}\n`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`SendGrid rejected the enrollment email (${response.status})`);
  }
}
