const express = require('express');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoutes'); // Adjust if path differs
const taskRoutes = require('./routes/taskRoutes'); // ✅ FIXED: import taskRoutes
const reminderRoutes = require('./routes/reminderRoutes');
const menstrualRoutes = require('./routes/menstrualRoutes'); // ✅ Menstrual API


const app = express();
app.use(bodyParser.json());

// Routes
app.use('/api', userRoutes);
app.use('/api', taskRoutes); // ✅ FIXED: use after import
app.use('/api', reminderRoutes);
app.use('/api', menstrualRoutes); // ✅ Mount menstrual routes under /api



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
