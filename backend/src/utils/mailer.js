import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";

export const sendEmail = async (to, subject, html) => {
  try {
    if (process.env.NODE_ENV === "production") {
      // ✅ Production → SendGrid Web API
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to,
        from: process.env.EMAIL_FROM, // must be a verified sender in SendGrid
        subject,
        html,
      };

      const response = await sgMail.send(msg);
      console.log("📧 Email sent (SendGrid Web API):", response[0].statusCode);
      return response;
    } else {
      // ✅ Development → Mailtrap via Nodemailer SMTP
      const transporter = nodemailer.createTransport({
        host: process.env.DEV_EMAIL_HOST,
        port: Number(process.env.DEV_EMAIL_PORT) || 2525,
        auth: {
          user: process.env.DEV_EMAIL_USER,
          pass: process.env.DEV_EMAIL_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || `"Eventure <sue.holding55@gmail.com>"`,
        to,
        subject,
        html,
      });

      console.log("📧 Email sent (Mailtrap Sandbox):", info.messageId);
      return info;
    }
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
    return null; // booking still succeeds
  }
};



// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// export const sendEmail = async (to, subject, html) => {
//   let transporter;

//   if (process.env.NODE_ENV === "production") {
//     // ✅ Production - SendGrid
//     transporter = nodemailer.createTransport({
//       host: process.env.PROD_EMAIL_HOST, // smtp.sendgrid.net
//       port: Number(process.env.PROD_EMAIL_PORT) || 587,
//       auth: {
//         user: process.env.PROD_EMAIL_USER, // always "apikey"
//         pass: process.env.PROD_EMAIL_PASS, // your SendGrid API key
//       },
//       secure: false, // STARTTLS
//       tls: {
//         rejectUnauthorized: false, // prevents TLS cert errors on Render
//       },
//     });
//   } else {
//     // ✅ Development - Mailtrap
//     transporter = nodemailer.createTransport({
//       host: process.env.DEV_EMAIL_HOST,
//       port: Number(process.env.DEV_EMAIL_PORT) || 2525,
//       auth: {
//         user: process.env.DEV_EMAIL_USER,
//         pass: process.env.DEV_EMAIL_PASS,
//       },
//     });
//   }

//   try {
//     const info = await transporter.sendMail({
//       from: process.env.EMAIL_FROM || `"Eventure" <no-reply@eventure.com>`,
//       to,
//       subject,
//       html,
//     });

//     if (process.env.NODE_ENV === "production") {
//       console.log("📧 Email sent (SendGrid):", info.messageId);
//     } else {
//       console.log("📧 Email sent (Mailtrap Sandbox):", info.messageId);
//     }

//     return info;
//   } catch (err) {
//     console.error("❌ Failed to send email:", err.message);

//     // 👉 Optional: don’t throw, so booking still succeeds
//     return null;
//   }
// };