const express = require('express');
const { body } = require('express-validator'); // Validates req.body fields

const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post(
  '/post',
  [body('title').trim().isLength({ min: 5 }), body('content').trim().isLength({ min: 5 })], // We are matching to form validatikon on the react frontend point carried out @ Feed/FeedEdit/FeedEdit.jsx
  feedController.postPost
);

// GET /feed/post/:postId
router.get('/post/:postId', feedController.getPost);

module.exports = router;
