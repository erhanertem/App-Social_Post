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

exports.updatePost = (req, res, next) => {
  // GUARD CLAUSE - Handle validation errors
  const errors = validationResult(req); // Extract any errors within the request object
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }

  const postId = req.params.postId;
  const { title, content, image: imageUrl } = req.body;
  // GUARD CLAUSE - Handle none-existing image
  if (!imageUrl) {
    const error = new Error('No file picked');
    error.statusCode = 422;
    throw error;
  }
  // If there is a multer image, consider this as a replacement image
  if (req.file) {
    imageUrl = req.file.path.replace('\\', '/');
  }
  // Find the post in the database using the acquired id
  Post.findById(postId) // May return null or undefined so in absense of a post, we need to handle this in the then block
    .then((post) => {
      // GUARD CLAUSE - Unavailable resource
      if (!post) {
        const error = new Error('Could not find post');
        error.statusCode = 404;
        throw error;
      }

      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;

      return post.save();
    })
    .then((result) => res.status(200).json({ message: 'Post updated!', post: result })) // No new content created so status is 200. In postPOST, it was 201.
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postPost = (req, res, next) => {
  // GUARD CLAUSE - Handle validation errors
  const errors = validationResult(req); // Extract any errors within the request object
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    throw error; // ---> shoots to next catch error handler
    // return res.status(422).json({ message: 'Validation failed, entered data is incorrect', errors: errors.array() }); // errors.array() belongs to express-validator and returns an array of reported errors
  }
  // GUARD CLAUSE - Handle no file submission
  if (!req.file) {
    const error = new Error('No image provided');
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path.replace('\\', '/'); // req.file is provided by Multer middleware. Convert Windows backslashes to forward slashes for universal path
  const { title, content } = req.body;

  const post = new Post({ title, imageUrl, content, creator: { name: 'Erhan ERTEM' } });
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
      console.log('⛔', err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
