export const htmlTemplate = (resetUrl, name = "User") => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Password Reset</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
  
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:20px;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#4f46e5; color:#ffffff; padding:20px; text-align:center;">
              <h1 style="margin:0;">DevTinder</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333;">
              <h2 style="margin-top:0;">Hi ${name},</h2>
              <p>You requested to reset your password.</p>
              <p>Click the button below to reset your password:</p>

              <!-- Button -->
              <div style="text-align:center; margin:30px 0;">
                <a href="${resetUrl}" 
                   style="background:#4f46e5; color:#ffffff; padding:12px 20px; text-decoration:none; border-radius:5px; display:inline-block;">
                   Reset Password
                </a>
              </div>

              <p>If you didn’t request this, please ignore this email.</p>
              <p>This link will expire in 10 minutes.</p>

              <p>Thanks,<br/>Team DevTinder</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f4f4f4; text-align:center; padding:15px; font-size:12px; color:#777;">
              © 2026 DevTinder. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
