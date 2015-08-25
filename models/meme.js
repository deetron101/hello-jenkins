var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var memeSchema = new mongoose.Schema({
  userid: Number,
  filename: String,
  name: String
});

var Meme = mongoose.model('Meme', memeSchema);

module.exports = Meme;