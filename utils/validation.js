const { ValidationError } = require('./errors');
const dateTime = require('../utils/dateTime');

const MAX_DESC = 500;
const STATUSES = ['pending', 'in-progress', 'completed'];
const PRIORITIES = ['low', 'medium', 'high'];

const validateId = (idStr) => {
    const regExp = /^0*[1-9]\d*$/;
    const cleanId = (idStr ?? '').trim();

    if (!regExp.test(cleanId)) {
        throw new ValidationError(`Invalid task ID: ${idStr}`);
    }

    return Number(cleanId);
};

const validateData = (data) => {
    if (!data.title || typeof data.title !== 'string') {
        throw new ValidationError('Title is required and must be a string');
    } else if (data.title.length < 3 || data.title.length > 100) {
        throw new ValidationError('Title must be 3-100 characters');
    }

    if (data.description) {
        if (typeof data.description !== 'string') {
            throw new ValidationError(`Description must be a string`);
        }

        if (data.description.length > MAX_DESC) {
            throw new ValidationError(
                `Description too long (max ${MAX_DESC} characters)`,
            );
        }
    }

    if (data.status && !STATUSES.includes(data.status)) {
        throw new ValidationError(`Invalid status value: ${data.status}`);
    }

    if (data.priority && !PRIORITIES.includes(data.priority)) {
        throw new ValidationError(`Invalid priority value: ${data.priority}`);
    }

    if (data.dueDate) {
        if (!dateTime.isValidFormat(data.dueDate)) {
            throw new ValidationError(
                `Invalid dueDate format: ${data.dueDate}. It must be in the format yyyy-mm-dd`,
            );
        }

        if (!dateTime.isValidDate(data.dueDate)) {
            throw new ValidationError(`Invalid dueDate: ${data.dueDate}.`);
        }
    }

    if (data.tags) {
        if (
            !Array.isArray(data.tags) ||
            data.tags.some((tag) => typeof tag !== 'string')
        ) {
            throw new ValidationError(
                `Invalid tags: ${data.tags}. Tags should be an array of strings.`,
            );
        }
    }

    return true;
};

const validatePage = (page) => {
    const num = Number(page);

    if (!Number.isInteger(num) || num < 1) {
        throw new ValidationError(`Invalid page number: ${page}`);
    }

    return true;
};

const validateLimit = (limit) => {
    const num = Number(limit);

    if (!Number.isInteger(num)) {
        throw new ValidationError(`Invalid limit number: ${limit}`);
    }

    return true;
};

const cleanData = (data) => {
    const cleaned = {
        title: data.title?.trim(),
        description: data.description?.trim() || '',
        status: data.status?.trim() || 'pending',
        priority: data.priority?.trim() || 'medium',
        tags: data.tags || [],
    };

    if (data.dueDate) {
        cleaned.dueDate = data.dueDate.trim();
    }

    return cleaned;
};

module.exports = {
    validateId,
    validateData,
    validatePage,
    validateLimit,
    cleanData,
};
