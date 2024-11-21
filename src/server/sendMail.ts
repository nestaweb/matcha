import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.APP_PASSWORD
    }
})

export default transporter;