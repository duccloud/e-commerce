import emailQueue from './queue';
import { sendEmail } from '../services/emailService';

// Define a job processor for sending emails
emailQueue.process(async (job) => {
    const { recipient, subject, text } = job.data;

    try {
        await sendEmail(recipient, subject, text);
        console.log(`Email sent to ${recipient}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
});
