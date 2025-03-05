const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({
        message: 'Fetched posts successfully',
        posts,
      });
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

  // DUMMY RESPONSE
  // res.status(200).json({
  //   posts: [
  //     {
  //       _id: '1',
  //       title: 'First Post',
  //       content: 'This is the first post',
  //       imageUrl: 'images/duck.jpg',
  //       creator: {
  //         name: 'Erhan Ertem',
  //       },
  //       createdAt: new Date(),
  //     },
  //   ],
  // });
};

exports.getPost = (req, res, next) => {
  // Acquire params value
  const postId = req.params.postId;
  // Find the post in the database using the acquired id
  Post.findById(postId)
    .then((post) => {
      // GUARD CLAUSE - Unavailable resource
      if (!post) {
        const error = new Error('Could not find post');
        error.statusCode = 404;
        throw error;
      }
      // Return response
      res.status(200).json({ message: 'Post fetched', post });
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postPost = (req, res, next) => {
  const errors = validationResult(req); // Extract any errors within the request object
  // If we do have errors...
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    throw error; // ---> shoots to next catch error handler
    // return res.status(422).json({ message: 'Validation failed, entered data is incorrect', errors: errors.array() }); // errors.array() belongs to express-validator and returns an array of reported errors
  }

  const { title, content } = req.body;

  const post = new Post({ title, imageUrl: 'images/headphone.jpeg', content, creator: { name: 'Erhan ERTEM' } });
  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: 'Post created successfully',
        post: result,
      });
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
