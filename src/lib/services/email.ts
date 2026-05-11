import { Resend } from 'resend';

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const apiKey = process.env.RESEND_API_KEY || '';
  const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';
  if (!apiKey) return { sent: false as const, reason: 'RESEND_API_KEY is missing' };

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to: [to],
      subject: 'DmGo password reset',
      text: `You requested a password reset.\n\nUse this link to set a new password:\n${resetUrl}\n\nThis link expires in 30 minutes.`,
      html: `<p>You requested a password reset.</p><p><a href="${resetUrl}">Reset your password</a></p><p>This link expires in 30 minutes.</p>`,
    });
    return { sent: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Resend send failed';
    return { sent: false as const, reason: message };
  }
}
