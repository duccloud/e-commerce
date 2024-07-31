import Bull from 'bull';

// Create a new Bull queue
const emailQueue = new Bull('emailQueue', {
    redis: { host: 'localhost', port: 6379 },
});

export default emailQueue;
