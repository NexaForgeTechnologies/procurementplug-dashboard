const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, ".env.local") });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_ROUNDTABLE_USER,
    pass: process.env.SMTP_ROUNDTABLE_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ App Password FAILED or MFA still blocking:", error);
  } else {
    console.log("✅ App Password is working! SMTP connected.");
  }
});
