const express = require('express');
const app = express();

//Body parser middleware
app.use(express.json());

//Tasks API routes
app.use('/api/tasks', require('./routes/tasks'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
