const { validationResult } = require('express-validator');

const validationHandler = (req, res, next) => {
  const errors = validationResult(req); // Extract any errors within the request object

  // GUARD CLAUSE - check for validation errors in the req.body
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    throw error; // ---> shoots to next catch error handler
    // // return res.status(422).json({ message: 'Validation failed, entered data is incorrect', errors: errors.array() }); // errors.array() belongs to express-validator and returns an array of reported errors
  }

  // If no validation errors, move to the next middleware or route handler
  next();
};

module.exports = validationHandler;
