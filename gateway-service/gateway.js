const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from React app
  credentials: true, // Allow cookies and authorization headers
  methods: 'GET,POST,PUT,PATCH,DELETE'
}));

const userServiceProxy = createProxyMiddleware({
  target: process.env.USER_SERVICE_URL, 
  changeOrigin: true
});

const taskServiceProxy = createProxyMiddleware({
  target: process.env.TASK_SERVICE_URL,
  changeOrigin: true, 
});

// Route for user service
app.use('/users', userServiceProxy);

// Route for task service
app.use('/tasks', taskServiceProxy);

app.get('/', (req, res) => {
  res.send('API Gateway is Running...');
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Start the gateway service on port 5000
app.listen(5000, () => {
  console.log('Gateway service is running on http://localhost:5000');
});