const nodemailer = require("nodemailer");
const {mailOpts,transporterOpts}=require("../config/nodeMail.config")
const sendEmail = async (opts) => {
  // Transporter
  const transporter = nodemailer.createTransport(transporterOpts())
    // Mail
  const mailOptions = mailOpts(opts);
  // Sending
  await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;
