const nodemailer = require('nodemailer')
require("dotenv").config()

const service = 'gmail'
const user = process.env.EMAIL_USER
const pass = process.env.EMAIL_PASS
const transport = nodemailer.createTransport({
  auth: { user, pass },
  service
})

exports.sendEmail = (to, subject, html) => {
  const mailOptions = {
    from: user,
    to: to,
    subject: subject,
    html: html
  }
  return transport.sendMail(mailOptions)
}
