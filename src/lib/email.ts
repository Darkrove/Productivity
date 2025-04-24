import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvitationEmail(
    email: string,
    inviterName: string,
    workspaceName: string,
    invitationToken: string
) {
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite?token=${invitationToken}`;

    try {
        const { data, error } = await resend.emails.send({
            from: `Productivity App <${process.env.EMAIL_FROM}>`,
            to: [email],
            subject: `${inviterName} invited you to join ${workspaceName}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>You've been invited to join a workspace</h2>
          <p>${inviterName} has invited you to join their workspace "${workspaceName}" on Productivity App.</p>
          <div style="margin: 30px 0;">
            <a href="${inviteUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Accept Invitation</a>
          </div>
          <p>If you don't have an account yet, you'll be able to create one after accepting the invitation.</p>
          <p>Regards,<br>The Productivity Team</p>
        </div>
      `,
            text: `Hello,\n\n${inviterName} has invited you to join their workspace "${workspaceName}" on Productivity App.\n\nClick the link below to accept the invitation:\n${inviteUrl}\n\nIf you don't have an account yet, you'll be able to create one.\n\nRegards,\nThe Productivity Team`,
        });

        if (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send invitation email');
        }

        return data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send invitation email');
    }
}
