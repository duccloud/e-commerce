import winston from 'winston';

// Configure console transport
const consoleTransport = new winston.transports.Console({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
    ),
    level: 'debug',
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        consoleTransport,
    ],
});

export default logger;
