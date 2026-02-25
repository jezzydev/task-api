const express = require('express');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/tasks');
const app = express();

//Body parser middleware
app.use(express.json());

//Logger middleware
app.use(logger);

//Tasks API routes
app.use('/api/tasks', taskRoutes);

//If NO route matched in taskRoute (catch-all)
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

//Custom error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
