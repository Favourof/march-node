const nodemailer = require("nodemailer");
const envObj = require("../config/env");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: envObj.appEMail,
    pass: envObj.appPassword,
  },
});

const verifyTransport = async () => {
  try {
    await transporter.verify();

    console.log("Server is ready to take our messages");
  } catch (error) {
    console.log("Verification failed:", error);
  }
};

const sendMail = async () => {
  try {
    const info = await transporter.sendMail({
      from: envObj.appEMail, // sender address
      to: "abiodunhusinat@gmail.com", // list of recipients
      subject: "Hello", // subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // HTML body
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};

const sendWelcomingEmail = async (name, email) => {
  try {
    const info = await transporter.sendMail({
      from: envObj.appEMail,
      to: email,
      subject: `Welcome ${name}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Onboard!</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f6f9fc; font-family: sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .card { background-color: #ffffff; padding: 40px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .btn { background: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 12px 25px; border-radius: 6px; display: inline-block; font-weight: bold; }
        .footer { text-align: center; font-size: 12px; color: #a0aec0; padding: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1 style="color: #1a202c; font-size: 24px;">Welcome to the community! 🎉</h1>
            <p style="color: #4a5568; font-size: 16px; line-height: 24px;">Hi ${name},</p>
            <p style="color: #4a5568; font-size: 16px; line-height: 24px;">We are absolutely thrilled to have you here. Your account is officially set up and ready to go.</p>
            <p style="margin: 30px 0;"><a href="{{action_url}}" class="btn">Get Started Now</a></p>
            <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 20px 0;">
            <p style="color: #718096; font-size: 14px;">Cheers,<br><strong>The Team</strong></p>
        </div>
        <div class="footer">
            <p>123 Business Rd, Suite 100, San Francisco, CA 94103</p>
            <p><a href="#" style="color: #4f46e5;">Unsubscribe</a></p>
        </div>
    </div>
</body>
</html>`,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error while sending mail:", error);
  }
};

module.exports = { verifyTransport, sendMail, sendWelcomingEmail };
