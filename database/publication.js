const mongoose = require("mongoose");

// Publication Schema
const PublicationSchema = mongoose.Schema({
  id: Number,
  name: String,
  books: [String],
});

// Publication Model
const PublicationModel = mongoose.model("publications", PublicationSchema);

module.exports = PublicationModel;
