const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,      // e.g. "smtp.gmail.com"
  port: process.env.EMAIL_PORT || 587,
  secure: false,                     // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,   // your SMTP email
    pass: process.env.EMAIL_PASS,   // your SMTP password or app password
  },
});

const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"HarvestLink" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your OTP for Password Reset",
    text: `Your OTP code is: ${otp}. It is valid for 10 minutes.`,
    html: `<p>Your OTP code is: <b>${otp}</b>.</p><p>This code is valid for 10 minutes.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${toEmail}`);
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    throw error;
  }
};

module.exports = sendOtpEmail;
