import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true", // true = port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"EcoRide" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html
    });

    console.log(`📧 Email envoyé à ${to}`);
  } catch (error) {
    console.error("❌ Erreur envoi email :", error);
  }
};

export default sendEmail;
