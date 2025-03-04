const mongoose = require('mongoose');

// Instantiate a mongoose Schema
const Schema = mongoose.Schema;

// Define the Schema
const postSchema = new Schema(
  {
    title: { type: String, requried: true },
    imageUrl: { type: String, required: true },
    content: { type: String, required: true },
    creator: { type: Object, required: true },
  },
  { timestamps: true } // Timestamp each item when created
);

// Create a Post DB on mongoose and apply the Schema
module.exports = mongoose.model('Post', postSchema);
