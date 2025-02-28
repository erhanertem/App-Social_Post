const { validationResult } = require('express-validator');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: '1',
        title: 'First Post',
        content: 'This is the first post',
        imageUrl: 'images/duck.jpg',
        creator: {
          name: 'Erhan Ertem',
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.postPost = (req, res, next) => {
  const errors = validationResult(req); // Extract any errors within the request object
  // If we do have errors...
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation failed, entered data is incorrect', errors: errors.array() }); // errors.array() belongs to express-validator and returns an array of reported errors
  }

  const { title, content } = req.body;

  // Create post in db
  res.status(201).json({
    message: 'Post created succesfully',
    post: { _id: new Date().toISOString(), title, content, creator: { name: 'Erhan Ertem' }, createdAt: new Date() },
  });
};
