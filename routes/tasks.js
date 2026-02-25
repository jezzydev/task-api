const { FILE } = require('dns');
const express = require('express');
const router = express.Router();
const fs = require('fs/promises');
const path = require('path');

const FILEPATH_TASKS = path.join(__dirname, '../data', 'tasks.json');
const MAX_DESC = 500;
const STATUSES = ['pending', 'in-progress', 'completed'];
const PRIORITIES = ['low', 'medium', 'high'];

//GET
//Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await getTasks();
        res.json(tasks);
    } catch (error) {
        res.json({
            error: `Error retrieving all tasks.`,
            code: `500 INTERNAL SERVER ERROR`,
        });
    }
});

//Get a single task by ID
router.get('/:id', async (req, res) => {
    try {
        const tasks = await getTasks();
        const id = validateId(req.params.id);

        if (!id) {
            res.json({
                error: `Invalid task ID: ${req.params.id}`,
                code: `400 BAD REQUEST`,
            });
        }

        const task = tasks.find((t) => t.id === id);

        if (task) {
            res.json(task);
        } else {
            res.json({ error: `Task not found`, code: `404 NOT FOUND` });
        }
    } catch (error) {
        res.json({
            error: `Error retrieving task with ID: ${req.params.id}`,
            code: `500 INTERNAL SERVER ERROR`,
        });
    }
});

//Update existing task
router.put('/:id', async (req, res) => {
    try {
        const tasks = await getTasks();
        const id = validateId(req.params.id);

        if (!id) {
            res.json({
                error: `Invalid task ID: ${req.params.id}`,
                code: `400 BAD REQUEST`,
            });
        }

        if (!validateData(req.body)) {
            throw new Error('Invalid task data');
        }

        let updTask = null;
        let updIndex = -1;

        for (const [index, task] of tasks.entries()) {
            if (task.id === id) {
                updTask = {
                    ...task,
                    ...req.body,
                    updatedAt: new Date().toISOString(),
                };
                updIndex = index;
                break;
            }
        }

        if (updTask) {
            tasks.splice(updIndex, 1, updTask);
            await fs.writeFile(FILEPATH_TASKS, JSON.stringify(tasks));
            res.json(updTask);
        } else {
            res.json({ error: `Task not found`, code: `404 NOT FOUND` });
        }
    } catch (error) {
        res.json({
            error: 'Error while updating task.',
            code: '500 INTERNAL SERVER ERROR',
        });
    }
});

//Delete existing task
router.delete('/:id', async (req, res) => {
    try {
        const tasks = await getTasks();
        const id = validateId(req.params.id);

        if (!id) {
            res.json({
                error: `Invalid task ID: ${req.params.id}`,
                code: `400 BAD REQUEST`,
            });
        }

        const filteredTasks = tasks.filter((t) => t.id !== id);

        if (tasks.length !== filteredTasks.length) {
            await fs.writeFile(FILEPATH_TASKS, JSON.stringify(filteredTasks));
            res.json({ message: 'Task deleted' });
        } else {
            res.json({ error: `Task not found`, code: `404 NOT FOUND` });
        }
    } catch (error) {
        res.json({
            error: 'Error while deleting task.',
            code: '500 INTERNAL SERVER ERROR',
        });
    }
});

//Create a new task
router.post('/', async (req, res) => {
    try {
        const tasks = await getTasks();

        if (!validateData(req.body)) {
            throw new Error('Invalid task data');
        }

        const task = {
            id: tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
            ...req.body,
            createdAt: new Date().toISOString(),
        };
        tasks.push(task);
        await fs.writeFile(FILEPATH_TASKS, JSON.stringify(tasks));
        res.json(task);
    } catch (error) {
        res.json({
            error: error.message,
            code: '400 BAD REQUEST',
        });
    }
});

function validateData(data) {
    if (!data.title || data.title.length < 3 || data.title.length > 100) {
        throw new Error('Title is required or title must be 3-100 characters');
    }

    if (data.description && data.description.length > MAX_DESC) {
        throw new Error(`Description too long (max ${MAX_DESC} characters)`);
    }

    if (data.status && !STATUSES.some((s) => s === data.status)) {
        throw new Error('Invalid status value');
    }

    if (data.priority && !PRIORITIES.some((p) => p === data.priority)) {
        throw new Error('Invalid priority value');
    }

    return true;
}

function validateId(idStr) {
    if (idStr && idStr.trim().length > 0) {
        const id = Number(idStr);
        return isNaN(id) ? null : id;
    }

    return null;
}

async function getTasks() {
    try {
        const tasks = await fs.readFile(FILEPATH_TASKS, { encoding: 'utf8' });
        return JSON.parse(tasks || []);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }

        throw error;
    }
}

module.exports = router;
