const dateTimeFormatter = require('../utils/dateTime');

const logger = (req, res, next) => {
    const now = new Date();
    const timestamp =
        dateTimeFormatter.formatDate(now) +
        ' ' +
        dateTimeFormatter.formatTime(now);

    console.log(`[${timestamp}]: ${req.method} ${req.originalUrl}`);

    next();
};

module.exports = logger;
