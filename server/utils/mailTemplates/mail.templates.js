const baseEmailWrapper = (title, contentHtml) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header { background-color: #111827; color: #ffffff; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.5px; }
    .content { padding: 32px 24px; color: #374151; line-height: 1.6; }
    .otp-box { margin: 24px 0; padding: 18px; background-color: #f3f4f6; border-radius: 6px; text-align: center; }
    .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #111827; }
    .footer { padding: 16px 24px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${title}</h1>
    </div>
    <div class="content">
      ${contentHtml}
    </div>
    <div class="footer">
      <p>If you didn't request this action, please ignore this email or change your security credentials.</p>
    </div>
  </div>
</body>
</html>
`;

const otpEmail = ({ code, purpose, expiresInMinutes = 5 }) => {
  const isVerification = purpose === "verify-email";
  const actionText = isVerification
    ? "verify your email address"
    : "reset your account password";

  const subject = isVerification
    ? "Verify your email address"
    : "Reset your password";

  const contentHtml = `
    <p>Hello,</p>
    <p>Please use the following code to <strong>${actionText}</strong>. This code is valid for <strong>${expiresInMinutes} minutes</strong>.</p>
    <div class="otp-box">
      <div class="otp-code">${code}</div>
    </div>
    <p>Do not share this code with anyone. Our team will never ask for your verification code.</p>
  `;

  return {
    subject,
    text: `Your verification code is ${code}. It expires in ${expiresInMinutes} minutes.`,
    html: baseEmailWrapper(subject, contentHtml),
  };
};

const passwordChangedEmail = ({ changedAt, ip, userAgent }) => {
  const subject = "Security Alert: Password Changed";
  const contentHtml = `
    <p>Hello,</p>
    <p>Your account password was successfully updated on <strong>${new Date(changedAt).toUTCString()}</strong>.</p>
    <ul style="margin: 16px 0; padding-left: 20px;">
      <li><strong>IP Address:</strong> ${ip || "Unknown"}</li>
      <li><strong>Device:</strong> ${userAgent || "Unknown"}</li>
    </ul>
    <p>If you did not perform this change, please reset your password immediately or contact support.</p>
  `;

  return {
    subject,
    text: `Your password was successfully updated at ${new Date(changedAt).toUTCString()}. If you did not perform this, contact support immediately.`,
    html: baseEmailWrapper(subject, contentHtml),
  };
};

const welcomeEmail = ({ name }) => {
  const subject = "Welcome to our platform!";
  const contentHtml = `
    <p>Hi ${name || "there"},</p>
    <p>Thanks for joining us! Your account has been created successfully.</p>
    <p>Get started by setting up your profile and exploring your dashboard.</p>
  `;

  return {
    subject,
    text: `Hi ${name || "there"}, welcome to the platform!`,
    html: baseEmailWrapper(subject, contentHtml),
  };
};

module.exports = {
  otpEmail,
  passwordChangedEmail,
  welcomeEmail,
};
