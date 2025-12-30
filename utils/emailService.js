const nodemailer  = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})
exports.sendMail = (options) => {
    transporter.sendMail({
        from: `From ${process.env.EMAIL_USER}`,
        ...options
    })
}
