const extractRelativePath = require('../util/extractRelativePath');
const clearImage = require('../util/clearImage');
const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1; // Defaults to 1 if query param is undefined
  const perPage = process.env.VITE_PAGINATE_ITEMS_PER_PAGE || 5;
  let totalItems;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage) // Skips previous pages of items
        .limit(perPage); // grap the set of next items per page
    })
    .then((posts) => {
      res.status(200).json({
        message: 'Fetched posts successfully',
        posts,
        totalItems,
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

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      // GUARD CLAUSE - Does it exist in the DB
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }

      // First attempt to delete the post in the DB
      return Post.findByIdAndDelete(postId).then((result) => {
        console.log(result);
        clearImage(post.imageUrl); // Delete image only after successful DB deletion
        res.status(200).json({ message: 'Post deleted!' });
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

exports.updatePost = (req, res, next) => {
  // // GUARD CLAUSE - Handle validation errors
  // const errors = validationResult(req); // Extract any errors within the request object
  // if (!errors.isEmpty()) {
  //   const error = new Error('Validation failed, entered data is incorrect');
  //   error.statusCode = 422;
  //   throw error;
  // }

  const postId = req.params.postId;
  let { title, content, image: imageUrl } = req.body;
  console.log('imageUrl :', imageUrl);

  // GUARD CLAUSE - If there is a multer image upload, consider this as a replacement image
  if (req.file) {
    console.log('req.file.path :', req.file.path);
    imageUrl = extractRelativePath(req.file.path);
  }
  // GUARD CLAUSE - Handle none-existing image
  if (!imageUrl) {
    const error = new Error('No file picked');
    error.statusCode = 422;
    throw error;
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
      // GUARD CLAUSE - same image content
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
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
  // GUARD CLAUSE - Handle no file submission
  if (!req.file) {
    const error = new Error('No image provided');
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = extractRelativePath(req.file.path);
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
