const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
  },
});

module.exports = model('users', userSchema);
