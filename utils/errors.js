class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.status = 400;
        this.name = 'ValidationError';
    }
}

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.status = 404;
        this.name = 'NotFoundError';
    }
}

module.exports = { ValidationError, NotFoundError };
