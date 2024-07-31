import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail', // or another email service provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
