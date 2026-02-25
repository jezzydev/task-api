const { ValidationError } = require('./errors');

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

    return true;
};

const cleanData = (data) => {
    return {
        title: data.title?.trim(),
        description: data.description?.trim() || '',
        status: data.status?.trim() || 'pending',
        priority: data.priority?.trim() || 'medium',
    };
};

module.exports = {
    validateId,
    validateData,
    cleanData,
};
