const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
// Load appropriate .env file based on NODE_ENV
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: path.resolve(__dirname, envFile) });

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const makeFolderIfDoesNotExist = require('./util/makeFolder');

// Initialize Uploads Directory
makeFolderIfDoesNotExist('uploads');

// Init Express App
const app = express();
// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(
//       null, // Errror
//       'images/' // Folder name
//     );
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = file.fieldname + '-' + new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname;
//     const sanitizedFilename = uniqueSuffix.replace(/\s+/g, '_'); // Replace spaces with underscore
//     cb(null, sanitizedFilename);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const fileTypes = ['image/png', 'image/jpeg', 'image/jpg'];
//   if (fileTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     const allowedExtensions = fileTypes.map((type) => type.split('/')[1]).join(', ');
//     cb(new Error(`Only image files with ${allowedExtensions} extensions are allowed`), false);
//   }
// };

// // Text type only form submission parser
// app.use(express.urlencoded({ extended: false }));

// Middleware to parse incoming data
app.use(express.json()); // Parses JSON data (application/json)
app.use(express.urlencoded({ extended: true })); // Parse text only form-data (application/x-www-form-urlencoded)

// // Multer middleware to handle image uploads
// app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
// Middleware to serve static files
//**
// NOTE:
// Order of Execution: Middleware functions are executed sequentially. If express.static() is placed before express.json(), it will handle requests for static files first. This can lead to unexpected behavior if a request is intended to be processed by express.json() but is intercepted by express.static().
// Performance: Placing express.static() after express.json() ensures that only requests that are not handled by other middleware (like express.json()) will be served as static files. This can improve performance by reducing unnecessary file system access.
//  */
app.use(
  '/uploads', // URL Filtering: Serve any URL with @root/uploads/....
  express.static(
    path.join(__dirname, 'uploads') //constructs the absolute path to the uploads directory,
  )
);

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
app.use('/auth', authRoutes); // Prefixes the endpoint URL with /auth

// -> Error Handling Middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  const { statusCode = 500, message = 'Something went wrong!', data } = error;
  res.status(statusCode).json({ message, data });
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
