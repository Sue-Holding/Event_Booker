import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";

export const sendEmail = async (to, subject, html) => {
  try {
    if (process.env.NODE_ENV === "production") {
      // Production SendGrid Web API
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to,
        from: process.env.EMAIL_FROM, 
        subject,
        html,
        replyTo: process.env.REPLY_TO || "sue.holding55@gmail.com", 
      };

      const [response] = await sgMail.send(msg);
      console.log("📧 Email sent (SendGrid):", response.statusCode);
      return response;

    } else {
      // Development → Mailtrap via Nodemailer SMTP
      const transporter = nodemailer.createTransport({
        host: process.env.DEV_EMAIL_HOST,
        port: Number(process.env.DEV_EMAIL_PORT) || 2525,
        auth: {
          user: process.env.DEV_EMAIL_USER,
          pass: process.env.DEV_EMAIL_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || `"Eventure" <no-reply@eventure.com>`,
        to,
        subject,
        html,
      });

      console.log("📧 Email sent (Mailtrap Sandbox):", info.messageId);
      return info;
    }
    
  } catch (err) {
    // error response 
    if (err.response && err.response.body) {
      console.error("❌ Failed to send email:", JSON.stringify(err.response.body, null, 2));
    } else {
      console.error("❌ Failed to send email:", err.message);
    }
    return null; // allow booking to succeed
  }
};