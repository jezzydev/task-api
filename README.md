# Task Manager API

A RESTful API for managing tasks with support for filtering, sorting, pagination, search, and bulk operations.

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Express Version](https://img.shields.io/badge/express-5.2.1-blue)](https://expressjs.com/)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Request & Response Examples](#request--response-examples)
- [Error Handling](#error-handling)
- [Project Structure](#project-structure)

## Features

- ✅ Complete CRUD operations (Create, Read, Update, Delete)
- ✅ Filter tasks by status and priority
- ✅ Sort tasks by any field (ascending/descending)
- ✅ Search tasks by title or description
- ✅ Pagination support
- ✅ Task statistics by status and priority
- ✅ Bulk delete completed tasks
- ✅ Due dates with validation
- ✅ Tags for task categorization
- ✅ File-based data persistence (JSON)
- ✅ Input validation and error handling
- ✅ RESTful API design

## Tech Stack

**Runtime:** Node.js v18+  
**Framework:** Express.js v5  
**Data Storage:** File-based (JSON)  
**Validation:** Custom validation utilities

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)

Check versions:

```bash
node --version
npm --version
```

## Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/task-api.git
    cd task-api
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Start the server**

    ```bash
    # Development mode (with hot reload)
    npm run dev

    # Production mode
    npm start
    ```

The API will be available at `http://localhost:8000`

## Usage

### Quick Start

```bash
# Start the server
npm run dev

# Test the API
curl http://localhost:8000/api/tasks
```

## API Endpoints

### Base URL

```
http://localhost:8000/api/tasks
```

---

### Endpoints Overview

| Method | Endpoint           | Description                                                 |
| ------ | ------------------ | ----------------------------------------------------------- |
| GET    | `/api/tasks`       | Get all tasks (with filtering, sorting, pagination, search) |
| GET    | `/api/tasks/stats` | Get task statistics                                         |
| GET    | `/api/tasks/:id`   | Get single task by ID                                       |
| POST   | `/api/tasks`       | Create new task                                             |
| PUT    | `/api/tasks/:id`   | Update existing task                                        |
| DELETE | `/api/tasks/:id`   | Delete single task                                          |
| DELETE | `/api/tasks`       | Delete all completed tasks (bulk)                           |

---

### Task Object Schema

```json
{
    "id": 1,
    "title": "Learn Express.js",
    "description": "Complete Express crash course",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-03-01",
    "tags": ["learning", "backend"],
    "createdAt": "2026-02-26T10:00:00.000Z",
    "updatedAt": "2026-02-26T10:00:00.000Z"
}
```

**Field Descriptions:**

| Field         | Type    | Required       | Description                                                             |
| ------------- | ------- | -------------- | ----------------------------------------------------------------------- |
| `id`          | integer | Auto-generated | Unique task identifier                                                  |
| `title`       | string  | Yes            | Task title (3-100 characters)                                           |
| `description` | string  | No             | Task description (max 500 characters)                                   |
| `status`      | string  | No             | Task status: `pending`, `in-progress`, `completed` (default: `pending`) |
| `priority`    | string  | No             | Task priority: `low`, `medium`, `high` (default: `medium`)              |
| `dueDate`     | string  | No             | Due date in YYYY-MM-DD format                                           |
| `tags`        | array   | No             | Array of strings for categorization                                     |
| `createdAt`   | string  | Auto-generated | ISO 8601 timestamp                                                      |
| `updatedAt`   | string  | Auto-generated | ISO 8601 timestamp                                                      |

---

### Get All Tasks

```http
GET /api/tasks
```

**Query Parameters:**

| Parameter  | Type    | Description                                    | Example             |
| ---------- | ------- | ---------------------------------------------- | ------------------- |
| `status`   | string  | Filter by status                               | `?status=completed` |
| `priority` | string  | Filter by priority                             | `?priority=high`    |
| `search`   | string  | Search in title/description (case-insensitive) | `?search=express`   |
| `sort`     | string  | Sort by field                                  | `?sort=dueDate`     |
| `order`    | string  | Sort order: `asc` or `desc`                    | `?order=desc`       |
| `page`     | integer | Page number                                    | `?page=2`           |
| `limit`    | integer | Items per page                                 | `?limit=10`         |

**Examples:**

```bash
# Get all tasks
GET /api/tasks

# Get completed tasks
GET /api/tasks?status=completed

# Get high priority tasks sorted by due date
GET /api/tasks?priority=high&sort=dueDate&order=asc

# Search and paginate
GET /api/tasks?search=backend&page=1&limit=5
```

**Response (without pagination):**

```json
[
    {
        "id": 1,
        "title": "Learn Express.js",
        "description": "Complete Express crash course",
        "status": "in-progress",
        "priority": "high",
        "dueDate": "2026-03-01",
        "tags": ["learning", "backend"],
        "createdAt": "2026-02-26T10:00:00.000Z",
        "updatedAt": "2026-02-26T10:00:00.000Z"
    }
]
```

**Response (with pagination):**

```json
{
    "tasks": [
        {
            "id": 1,
            "title": "Learn Express.js",
            "description": "Complete Express crash course",
            "status": "in-progress",
            "priority": "high",
            "dueDate": "2026-03-01",
            "tags": ["learning", "backend"],
            "createdAt": "2026-02-26T10:00:00.000Z",
            "updatedAt": "2026-02-26T10:00:00.000Z"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "totalTasks": 25,
        "totalPages": 3
    }
}
```

---

### Get Task Statistics

```http
GET /api/tasks/stats
```

**Response:**

```json
{
    "statusCounts": {
        "pending": 5,
        "in-progress": 3,
        "completed": 12
    },
    "priorityCounts": {
        "low": 4,
        "medium": 8,
        "high": 8
    }
}
```

---

### Get Single Task

```http
GET /api/tasks/:id
```

**Response:** `200 OK`

```json
{
    "id": 1,
    "title": "Learn Express.js",
    "description": "Complete Express crash course",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2026-03-01",
    "tags": ["learning", "backend"],
    "createdAt": "2026-02-26T10:00:00.000Z",
    "updatedAt": "2026-02-26T10:00:00.000Z"
}
```

---

### Create Task

```http
POST /api/tasks
```

**Request Body:**

```json
{
    "title": "Build REST API",
    "description": "Create a task management API",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-03-15",
    "tags": ["project", "backend"]
}
```

**Validation Rules:**

- `title`: Required, 3-100 characters
- `description`: Optional, max 500 characters
- `status`: Optional, must be `pending`, `in-progress`, or `completed`
- `priority`: Optional, must be `low`, `medium`, or `high`
- `dueDate`: Optional, must be valid date in YYYY-MM-DD format
- `tags`: Optional, array of strings

**Response:** `201 Created`

```json
{
    "id": 2,
    "title": "Build REST API",
    "description": "Create a task management API",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-03-15",
    "tags": ["project", "backend"],
    "createdAt": "2026-02-26T11:00:00.000Z",
    "updatedAt": "2026-02-26T11:00:00.000Z"
}
```

---

### Update Task

```http
PUT /api/tasks/:id
```

**Request Body (partial update allowed):**

```json
{
    "status": "completed",
    "priority": "medium"
}
```

**Response:** `200 OK`

```json
{
    "id": 1,
    "title": "Learn Express.js",
    "description": "Complete Express crash course",
    "status": "completed",
    "priority": "medium",
    "dueDate": "2026-03-01",
    "tags": ["learning", "backend"],
    "createdAt": "2026-02-26T10:00:00.000Z",
    "updatedAt": "2026-02-26T12:00:00.000Z"
}
```

---

### Delete Task

```http
DELETE /api/tasks/:id
```

**Response:** `200 OK`

```json
{
    "message": "Task deleted"
}
```

---

### Bulk Delete Completed Tasks

```http
DELETE /api/tasks
```

**Response:** `200 OK`

```json
{
    "message": "Deleted 5 completed task(s)",
    "deleted": 5
}
```

If no completed tasks:

```json
{
    "message": "No completed tasks to delete"
}
```

---

## Request & Response Examples

### Using cURL

**Create a task:**

```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn Node.js",
    "description": "Study async patterns",
    "priority": "high",
    "dueDate": "2026-03-10",
    "tags": ["learning", "javascript"]
  }'
```

**Get all tasks with filtering and sorting:**

```bash
curl "http://localhost:8000/api/tasks?status=pending&sort=dueDate&order=asc"
```

**Search tasks:**

```bash
curl "http://localhost:8000/api/tasks?search=express"
```

**Get paginated results:**

```bash
curl "http://localhost:8000/api/tasks?page=2&limit=5"
```

**Update a task:**

```bash
curl -X PUT http://localhost:8000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

**Delete a task:**

```bash
curl -X DELETE http://localhost:8000/api/tasks/1
```

**Get statistics:**

```bash
curl http://localhost:8000/api/tasks/stats
```

**Bulk delete completed:**

```bash
curl -X DELETE http://localhost:8000/api/tasks
```

### Using JavaScript (Fetch)

```javascript
const API_URL = 'http://localhost:8000/api/tasks';

// Create task
const createTask = async (taskData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
    });
    return await response.json();
};

// Get all tasks with filtering
const getTasks = async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}?${params}`);
    return await response.json();
};

// Update task
const updateTask = async (id, updates) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    return await response.json();
};

// Delete task
const deleteTask = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    return await response.json();
};

// Usage examples
await createTask({
    title: 'Learn Express',
    priority: 'high',
    tags: ['backend'],
});

await getTasks({ status: 'pending', sort: 'dueDate' });
await updateTask(1, { status: 'completed' });
await deleteTask(1);
```

---

## Error Handling

### Error Response Format

All errors follow this consistent format:

```json
{
    "error": "Error message describing what went wrong"
}
```

### HTTP Status Codes

| Code  | Description                                     |
| ----- | ----------------------------------------------- |
| `200` | Success                                         |
| `201` | Created successfully                            |
| `400` | Bad Request - Invalid input or validation error |
| `404` | Not Found - Task doesn't exist                  |
| `500` | Internal Server Error                           |

### Common Errors

**400 Bad Request - Validation Error**

```json
{
    "error": "Title must be 3-100 characters"
}
```

**400 Bad Request - Invalid ID**

```json
{
    "error": "Invalid task ID: abc"
}
```

**400 Bad Request - Invalid Status**

```json
{
    "error": "Invalid status value: done"
}
```

**400 Bad Request - Invalid Date**

```json
{
    "error": "Invalid dueDate: 2026-13-45"
}
```

**404 Not Found**

```json
{
    "error": "Task not found: 999"
}
```

**400 Bad Request - Invalid Page**

```json
{
    "error": "Page 10 does not exist. Total pages: 3"
}
```

---

## Project Structure

```
task-api/
├── data/
│   └── tasks.json         # Task data storage
├── middleware/
│   ├── errorHandler.js    # Global error handling
│   └── logger.js          # Request logging
├── routes/
│   └── tasks.js           # Task routes
├── utils/
│   ├── dateTime.js        # Date formatting & validation
│   ├── errors.js          # Custom error classes
│   ├── fileManager.js     # File read/write operations
│   └── validation.js      # Input validation
├── .gitignore
├── package.json
├── README.md
└── server.js              # Entry point
```

---

## Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start

# Check code for errors
npm run lint

# Auto-fix linting errors
npm run lint:fix

# Format code with Prettier
npm run format
```

### Code Quality

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **Nodemon** for development hot reload

### Adding New Features

1. Add route in `routes/tasks.js`
2. Add validation in `utils/validation.js`
3. Update this README with new endpoint documentation

---

## Contributing

This is a learning project. Feel free to fork and modify for your own use!

---

**Built with ❤️ as part of the 30-Day Backend Career Experiment**
