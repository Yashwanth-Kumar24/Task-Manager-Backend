const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.TASK_SERVICE_PORT || 5002;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Start the server
app.listen(PORT, () => {
  console.log(`Task service running on port ${PORT}`);
});
