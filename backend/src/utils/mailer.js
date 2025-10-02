import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  let transporter;

  if (process.env.NODE_ENV === "production") {
    // ✅ Production - SendGrid
    transporter = nodemailer.createTransport({
      host: process.env.PROD_EMAIL_HOST, // smtp.sendgrid.net
      port: Number(process.env.PROD_EMAIL_PORT) || 587,
      auth: {
        user: process.env.PROD_EMAIL_USER, // always "apikey"
        pass: process.env.PROD_EMAIL_PASS, // your SendGrid API key
      },
      secure: false, // STARTTLS
      tls: {
        rejectUnauthorized: false, // prevents TLS cert errors on Render
      },
    });
  } else {
    // ✅ Development - Mailtrap
    transporter = nodemailer.createTransport({
      host: process.env.DEV_EMAIL_HOST,
      port: Number(process.env.DEV_EMAIL_PORT) || 2525,
      auth: {
        user: process.env.DEV_EMAIL_USER,
        pass: process.env.DEV_EMAIL_PASS,
      },
    });
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Eventure" <no-reply@eventure.com>`,
      to,
      subject,
      html,
    });

    if (process.env.NODE_ENV === "production") {
      console.log("📧 Email sent (SendGrid):", info.messageId);
    } else {
      console.log("📧 Email sent (Mailtrap Sandbox):", info.messageId);
    }

    return info;
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);

    // 👉 Optional: don’t throw, so booking still succeeds
    return null;
  }
};