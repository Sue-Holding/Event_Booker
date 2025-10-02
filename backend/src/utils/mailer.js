import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  let transporter;

  if (process.env.NODE_ENV === "production") {
    // Production - Mailtrap Transactional
    transporter = nodemailer.createTransport({
      host: process.env.PROD_EMAIL_HOST,
      port: process.env.PROD_EMAIL_PORT,
      auth: {
        user: process.env.PROD_EMAIL_USER,
        pass: process.env.PROD_EMAIL_PASS,
      },
    });
  } else {
    // Dev - Mailtrap Sandbox
    transporter = nodemailer.createTransport({
      host: process.env.DEV_EMAIL_HOST,
      port: process.env.DEV_EMAIL_PORT,
      auth: {
        user: process.env.DEV_EMAIL_USER,
        pass: process.env.DEV_EMAIL_PASS,
      },
    });
  }

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"Eventure" <no-reply@eventure.com>`,
    to,
    subject,
    html,
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("📧 Email sent (Mailtrap Sandbox):", info.messageId);
  }

  return info;
};
