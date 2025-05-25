export const GenerateOTP = (length: number = 6): string => {
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }

    return otp;
};

export const otpEmailTemplate = (otp: string, username: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your OTP Code</title>
  <style>
    body {
      background-color: #f0f4f8;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      color: #1e293b;
    }
    .email-wrapper {
      display: flex;
      justify-content: center;
      padding: 40px 20px;
    }
    .email-card {
      background: white;
      border-radius: 12px;
      max-width: 540px;
      width: 100%;
      padding: 40px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      border-top: 5px solid #4f46e5;
    }
    .email-header {
      text-align: center;
    }
    .email-header h1 {
      font-size: 24px;
      margin: 0;
      color: #1e40af;
    }
    .email-body {
      margin-top: 24px;
      font-size: 16px;
      line-height: 1.6;
      color: #334155;
    }
    .otp-container {
      text-align: center;
      margin: 30px 0;
    }
    .otp-code {
      background-color: #e0f2fe;
      color: #0c4a6e;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 6px;
      padding: 14px 30px;
      border-radius: 10px;
      border: 2px solid #3b82f6;
      display: inline-block;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      margin-top: 40px;
    }
    .footer strong {
      color: #475569;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-card">
      <div class="email-header">
        <h1>🔐 Verify Your Account</h1>
      </div>
      <div class="email-body">
        <p>Hello ${username},</p>
        <p>Your one-time password (OTP) for verifying your Storage Management account is below.</p>
        <div class="otp-container">
          <div class="otp-code">${otp}</div>
        </div>
        <p>This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
        <p>If you didn’t request this, please ignore this email.</p>
        <p>– The StorageMate Team</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} <strong>StorageMate</strong>. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
`;
