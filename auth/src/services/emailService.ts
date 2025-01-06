import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.APP_URL; // Use a backend-specific environment variable

export async function sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${domain}/auth/new-password?token=${token}`;
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
    });
}

export async function sendVerificationEmail(email: string, token: string) {
    const confirmLink = `${domain}/auth/verify-email?token=${token}`;
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Confirm your email",
        html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`
    });
}