const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./controller/userController');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/', userRoutes);

module.exports = app;
