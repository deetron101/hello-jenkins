var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    email: {type: String, unique: true, dropDups: true },
    password: String,
    role: String
});

/* User model */
var User = mongoose.model('User', userSchema);

module.exports = User;