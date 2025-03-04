const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
// Load appropriate .env file based on NODE_ENV
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: path.resolve(__dirname, envFile) });

const feedRoutes = require('./routes/feed');

// Init Express App
const app = express();

// // Text type only form submission parser
// app.use(express.urlencoded({ extended: false }));

// Middleware to parse JSON payloads (req.body parser - application/json)
app.use(express.json());

// Middleware to serve static files
// NOTE: Order of Execution: Middleware functions are executed sequentially. If express.static() is placed before express.json(), it will handle requests for static files first. This can lead to unexpected behavior if a request is intended to be processed by express.json() but is intercepted by express.static().
// Performance: Placing express.static() after express.json() ensures that only requests that are not handled by other middleware (like express.json()) will be served as static files. This can improve performance by reducing unnecessary file system access.
app.use('/images', express.static(path.join(__dirname, 'images')));

// 1️⃣ Handle CORS for normal requests - Allow communication between server and client domains
app.use((req, res, next) => {
  // Allow all origins
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  // Allow only these HTTP methods
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  // Allow these headers
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// 2️⃣ Handle CORS preflight (OPTIONS) requests explicitly - Ensure preflight requests dont block API calls.
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '600'); // Cache for 10 minutes
  res.sendStatus(204); // No content for OPTIONS reqs
});

// App Routes
app.use('/feed', feedRoutes); // Prefixes the endpoint URL with /feed

// Error Handling Middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  const { statusCode = 500, message = 'Something went wrong!' } = error;
  res.status(statusCode).json({ message });
});

// Start the server
const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST || 'localhost';
const NODE_ENV = process.env.NODE_ENV || 'development';
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_USER_PASS}@${process.env.MONGO_CLUSTER_NAME}.qqml4.mongodb.net/${process.env.MONGO_COLLECTION_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, DB_HOST, () => {
      console.log(`Listening on port ${PORT}, running on DB_HOST:${DB_HOST} in ${NODE_ENV} mode`);
    });
  })
  .catch((err) => console.error('Connection failed', err));
