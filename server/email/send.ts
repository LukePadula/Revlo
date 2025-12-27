import { Resend } from "resend";

const RESEND_API_KEY =
  process.env.RESEND_API_KEY || "re_Qb581ojV_7DqPQXt3e4WENpY9uNN4cWq6";
const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

// const resend = new Resend("re_Qb581ojV_7DqPQXt3e4WENpY9uNN4cWq6");

export async function getTemplate() {
  const resend = new Resend(RESEND_API_KEY);

  const { data, error } = await resend.templates.get(
    "02e16b81-54d9-402e-b498-1cb3ff7c0d1d"
  );

  console.log(data, error);
}

export async function sendOtpEmail(
  otpCode: string,
  recipientEmail: string,
  recipientName: string = "Recipient"
) {
  const resend = new Resend(RESEND_API_KEY);

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verification Code</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Verification Code</h1>
      </div>
      
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px; margin-bottom: 20px; color: #1f2937;">Hello ${recipientName},</p>
        
        <p style="font-size: 16px; margin-bottom: 20px; color: #374151;">
          You requested access to a document request. Please use the verification code below to continue:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; background: #eff6ff; padding: 20px 40px; border-radius: 8px; border: 2px dashed #2563eb;">
            <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb; margin: 0; font-family: monospace;">
              ${otpCode}
            </p>
          </div>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; margin: 20px 0;">
          This code will expire in <strong style="color: #2563eb;">5 minutes</strong>. If you didn't request this code, please ignore this email.
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            For security reasons, never share this code with anyone.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailText = `
Hello ${recipientName},

You requested access to a document request. Please use the verification code below to continue:

Verification Code: ${otpCode}

This code will expire in 5 minutes. If you didn't request this code, please ignore this email.

For security reasons, never share this code with anyone.
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: "Your Verification Code",
      html: emailHtml,
      text: emailText,
    });

    if (error) {
      console.error("Error sending OTP email:", error);
      throw new Error(`Failed to send OTP email: ${error.message}`);
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
}

interface SendRequestLinkEmailParams {
  recipientName: string;
  recipientEmail: string;
  requestTitle: string;
  requestLink: string;
  purpose?: string;
  expires?: string;
}

export async function sendRequestLinkEmail({
  recipientName,
  recipientEmail,
  requestTitle,
  requestLink,
  purpose,
  expires,
}: SendRequestLinkEmailParams) {
  const resend = new Resend(RESEND_API_KEY);

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document Request</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Document Request</h1>
      </div>
      
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px; margin-bottom: 20px; color: #1f2937;">Hello ${recipientName},</p>
        
        <p style="font-size: 16px; margin-bottom: 20px; color: #374151;">
          You have been requested to submit documents for: <strong style="color: #2563eb;">${requestTitle}</strong>
        </p>
        
        ${
          purpose
            ? `
        <div style="background: #eff6ff; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 3px solid #2563eb;">
          <p style="margin: 0; font-size: 14px; color: #2563eb; font-weight: 600;">Purpose:</p>
          <p style="margin: 5px 0 0 0; font-size: 14px; color: #374151;">${purpose}</p>
        </div>
        `
            : ""
        }
        
        ${
          expires && expires !== "no-expiry"
            ? `
        <div style="background: #fef3c7; padding: 12px 15px; border-radius: 6px; margin: 20px 0; border-left: 3px solid #f59e0b;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            <strong>⏰ Deadline:</strong> ${expires}
          </p>
        </div>
        `
            : ""
        }
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${requestLink}" 
             style="display: inline-block; background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3); transition: background-color 0.2s;">
            Submit Documents
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
          Or copy and paste this link into your browser:
        </p>
        <p style="font-size: 12px; color: #9ca3af; word-break: break-all; background: #f9fafb; padding: 10px; border-radius: 4px; border: 1px solid #e5e7eb;">
          ${requestLink}
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            This is a secure document request. Your files will be encrypted and stored safely.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailText = `
Hello ${recipientName},

You have been requested to submit documents for: ${requestTitle}

${purpose ? `Purpose: ${purpose}\n` : ""}
${expires && expires !== "no-expiry" ? `Deadline: ${expires}\n` : ""}

Please click the link below to submit your documents:
${requestLink}

This is a secure document request. Your files will be encrypted and stored safely.
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: `Document Request: ${requestTitle}`,
      html: emailHtml,
      text: emailText,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending request link email:", error);
    throw error;
  }
}

interface SendOrganizationInviteEmailParams {
  recipientEmail: string;
  recipientName?: string;
  organizationName: string;
  inviterName: string;
  invitationUrl: string;
  role: "admin" | "member";
}

export async function sendOrganizationInviteEmail({
  recipientEmail,
  recipientName,
  organizationName,
  inviterName,
  invitationUrl,
  role,
}: SendOrganizationInviteEmailParams) {
  const resend = new Resend(RESEND_API_KEY);

  const displayName = recipientName || recipientEmail.split("@")[0];
  const roleLabel = role === "admin" ? "Administrator" : "Member";

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Organization Invitation</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">You're Invited!</h1>
      </div>
      
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px; margin-bottom: 20px; color: #1f2937;">Hello ${displayName},</p>
        
        <p style="font-size: 16px; margin-bottom: 20px; color: #374151;">
          <strong style="color: #2563eb;">${inviterName}</strong> has invited you to join <strong style="color: #2563eb;">${organizationName}</strong> as a <strong>${roleLabel}</strong>.
        </p>
        
        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2563eb;">
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #2563eb; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Organization</p>
          <p style="margin: 0; font-size: 18px; color: #1f2937; font-weight: 600;">${organizationName}</p>
          <p style="margin: 5px 0 0 0; font-size: 14px; color: #6b7280;">Role: ${roleLabel}</p>
        </div>
        
        <p style="font-size: 16px; margin-bottom: 25px; color: #374151;">
          Click the button below to accept the invitation and join the organization:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${invitationUrl}" 
             style="display: inline-block; background: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3); transition: background-color 0.2s;">
            Accept Invitation
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
          Or copy and paste this link into your browser:
        </p>
        <p style="font-size: 12px; color: #9ca3af; word-break: break-all; background: #f9fafb; padding: 10px; border-radius: 4px; border: 1px solid #e5e7eb;">
          ${invitationUrl}
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            This invitation will expire in <strong style="color: #2563eb;">7 days</strong>. If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailText = `
Hello ${displayName},

${inviterName} has invited you to join ${organizationName} as a ${roleLabel}.

Organization: ${organizationName}
Role: ${roleLabel}

Click the link below to accept the invitation:
${invitationUrl}

This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: `You're invited to join ${organizationName} on Revlo`,
      html: emailHtml,
      text: emailText,
    });

    if (error) {
      console.error("Error sending organization invite email:", error);
      throw new Error(`Failed to send invitation email: ${error.message}`);
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending organization invite email:", error);
    throw error;
  }
}
