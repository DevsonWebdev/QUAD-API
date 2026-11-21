exports.transporterOpts =()=>({
  host:process.env.EMAIL_HOST,
  port:process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USERNAME,
    password:process.env.EMAIL_PASSWORD
  }
})


exports.mailOpts = (opts) => ({
  from: "Quad.io",
  to: opts.email,
  subject: opts.subject,
  text: opts.message,
  html:"<div>Hello there</div>"

})
