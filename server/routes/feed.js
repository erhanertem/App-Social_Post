const express = require('express');
const { body } = require('express-validator'); // Validates req.body fields
const { upload } = require('../middlewares/multerConfig');

const feedController = require('../controllers/feed');
const validationHandler = require('../middlewares/validationHandler');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post(
  '/post',
  upload({
    allowedMimeTypes: ['image/png', 'image/jpg', 'image/jpeg'],
    uploadType: 'single',
    fieldName: 'image',
    maxSize: 2,
    targetFolder: 'images',
  }),
  [body('title').trim().isLength({ min: 5 }), body('content').trim().isLength({ min: 5 })], // We are matching to form validatikon on the react frontend point carried out @ Feed/FeedEdit/FeedEdit.jsx
  validationHandler,
  feedController.postPost
);

// GET /feed/post/:postId
router.get('/post/:postId', feedController.getPost);

// DELETE /feed/post/:postId
router.delete('/post/:postId', feedController.deletePost);

// PUT /feed/post/:postId
router.put(
  '/post/:postId',
  upload({
    allowedMimeTypes: ['image/png', 'image/jpg', 'image/jpeg'],
    uploadType: 'single',
    fieldName: 'image',
    maxSize: 2,
    targetFolder: 'images',
  }),
  [body('title').trim().isLength({ min: 5 }), body('content').trim().isLength({ min: 5 })],
  validationHandler,
  feedController.updatePost
);

module.exports = router;
