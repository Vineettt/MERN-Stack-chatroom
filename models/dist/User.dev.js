"use strict";

var moongoose = require('mongoose');

var bcrypt = require('bcrypt');

var _require = require('validator'),
    isEmail = _require.isEmail;

var userSchema = new moongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name']
  },
  email: {
    type: String,
    required: [true, 'Please enter a email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'The password should be at least 6 character long']
  }
});
userSchema.pre('save', function _callee(next) {
  var salt;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(bcrypt.genSalt());

        case 2:
          salt = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(bcrypt.hash(this.password, salt));

        case 5:
          this.password = _context.sent;
          next();

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
});
var User = moongoose.model('user', userSchema);
module.exports = User;