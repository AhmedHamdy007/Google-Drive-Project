const express = require('express');
const cors = require('cors');
const connectDB = require('./db'); // Import connectDB function
require('dotenv').config();
const taskRoutes = require('./routes/tasks');
const timetableRoutes = require('./routes/timetable');

const app = express();
const port = 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Connect to the database
connectDB();

// Routes
app.use(require('./routes/auth'));
app.use(require('./routes/userSubjects'));
app.use(require('./routes/lecturerCourses'));

// Default route
app.get('/', (req, res) => {
    res.send('Backend is running...');
});
app.use('/users', require('./routes/users'));
app.use('/resources', require('./routes/resources'));
app.use('/api/tasks', taskRoutes);
app.use('/api/timetable', timetableRoutes);

// Start server
app.listen(port, () => {
    console.log(process.env.MONGO_URI);
    console.log(`Server running at http://localhost:${port}`);
});
