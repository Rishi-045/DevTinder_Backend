const nodemailer = require("nodemailer");
const { htmlTemplate } = require("./htmlTemplate");

const sendEmail = async (to, name, resetUrl) => {
  console.log(to, name, resetUrl);
  console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `DevTinder <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset Request",
    html: htmlTemplate(resetUrl, name),
  });
};

module.exports = sendEmail;
