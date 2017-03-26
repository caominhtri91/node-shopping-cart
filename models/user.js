const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.methods.encryptPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(5), '');

userSchema.methods.validPassword = function (password) {
  const user = this;
  return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', userSchema);
