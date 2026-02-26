const express = require('express');
const router = express.Router();
const path = require('path');
const validator = require('../utils/validation');
const errors = require('../utils/errors');
const fileManager = require('../utils/fileManager');
const FILEPATH_TASKS = path.join(__dirname, '../data', 'tasks.json');

//GET
//Get all tasks with filtering and sorting
router.get('/', async (req, res) => {
    let tasks = await getTasks();

    //filter
    if (req.query.status) {
        tasks = tasks.filter((t) => t.status === req.query.status);
    }

    if (req.query.priority) {
        tasks = tasks.filter((t) => t.priority === req.query.priority);
    }

    //sort
    if (req.query.sort) {
        const order = req.query.order ?? 'asc';
        tasks = sortData(tasks, req.query.sort, order);
    }

    //search (title/description)
    if (req.query.search) {
        tasks = tasks.filter(
            (t) =>
                t.title.includes(req.query.search) ||
                t.description.includes(req.query.search),
        );
    }

    //pagination
    if (req.query.page && validator.validatePage(req.query.page)) {
        const maxPages = Number(req.query.page);
        const limit =
            req.query.limit && validator.validateLimit(req.query.limit)
                ? Number(req.query.limit)
                : 10;
        let index = 0;
        let page = 1;
        const pagedTasks = [];

        while (page <= maxPages && index < tasks.length) {
            const t = {
                page,
                tasks: tasks.slice(index, index + limit),
            };

            pagedTasks.push(t);
            index += limit;
            page++;
        }

        tasks = pagedTasks;
    }

    res.json(tasks);
});

//Get stats
router.get('/stats', async (req, res) => {
    const tasks = await getTasks();
    const groupByStatus = Object.groupBy(tasks, ({ status }) => status);
    const transformedStatus = Object.keys(groupByStatus).map((key) => {
        return [key, groupByStatus[key].length];
    });
    const groupByPriority = Object.groupBy(tasks, ({ priority }) => priority);
    const transformedPriority = Object.keys(groupByPriority).map((key) => {
        return [key, groupByPriority[key].length];
    });
    res.json({
        ByStatus: { ...Object.fromEntries(transformedStatus) },
        ByPriority: { ...Object.fromEntries(transformedPriority) },
    });
});

//Get a single task by ID
router.get('/:id', async (req, res) => {
    const id = validator.validateId(req.params.id);
    const tasks = await getTasks();
    const task = tasks.find((t) => t.id === id);

    if (task) {
        res.json(task);
    } else {
        throw new errors.NotFoundError(`Task not found: ${req.params.id}`);
    }
});

//Create a new task
router.post('/', async (req, res) => {
    validator.validateData(req.body);
    const cleanedData = validator.cleanData(req.body);
    const tasks = await getTasks();
    const task = {
        id: tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
        ...cleanedData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    tasks.push(task);
    await fileManager.writeToFile(FILEPATH_TASKS, tasks);
    res.status(201).json(task);
});

//Update existing task
router.put('/:id', async (req, res) => {
    const id = validator.validateId(req.params.id);
    const tasks = await getTasks();
    validator.validateData(req.body);
    const cleanedData = validator.cleanData(req.body);
    const updIndex = tasks.findIndex((t) => t.id === id);

    if (updIndex === -1) {
        throw new errors.NotFoundError(
            `Task not found for ID ${req.params.id}`,
        );
    }

    tasks[updIndex] = {
        ...tasks[updIndex],
        ...cleanedData,
        updatedAt: new Date().toISOString(),
    };

    await fileManager.writeToFile(FILEPATH_TASKS, tasks);
    res.json(tasks[updIndex]);
});

//Delete existing task
router.delete('/:id', async (req, res) => {
    const id = validator.validateId(req.params.id);
    const tasks = await getTasks();
    const filteredTasks = tasks.filter((t) => t.id !== id);

    if (tasks.length !== filteredTasks.length) {
        await fileManager.writeToFile(FILEPATH_TASKS, filteredTasks);
        res.json({ message: 'Task deleted' });
    } else {
        throw new errors.NotFoundError(
            `Task not found for ID ${req.params.id}`,
        );
    }
});

//Bulk delete all completed tasks
router.delete('/', async (req, res) => {
    const tasks = await getTasks();
    const filteredTasks = tasks.filter((t) => t.status !== 'completed');

    await fileManager.writeToFile(FILEPATH_TASKS, filteredTasks);
    res.json({ message: 'All completed tasks deleted' });
});

async function getTasks() {
    try {
        const tasks = await fileManager.readFromFile(FILEPATH_TASKS);
        return JSON.parse(tasks || '[]');
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }

        throw error;
    }
}

function sortData(arrData, sortByProperty, order = 'asc') {
    return arrData.sort((a, b) => {
        const aVal = String(a[sortByProperty]);
        const bVal = String(b[sortByProperty]);
        const comparison = aVal.localeCompare(bVal, undefined, {
            numeric: true,
            sensitivity: 'base',
        });

        return order === 'asc' ? comparison : -comparison;
    });
}

module.exports = router;
