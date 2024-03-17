const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    name: String,
    email: {type: String, unique: true},
    password: String,
    Cpassword: String,
    imageProfile: [String],
    description: String,
    age: Number,
    language: String,
    lived: String,
    role: {type: String, default: 'user'},
  });

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;