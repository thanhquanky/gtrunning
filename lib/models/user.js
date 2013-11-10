'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt');
    
// Schema
var UserSchema = new Schema({
  name: String,
  password: String,
  age: Number,
  karma: Number,
  weight: Number,
  email: String
});

// Validations
UserSchema.path('age').validate(function (num) {
  return num >= 1 && num <= 100;
}, 'The age is too bizarre for human beings. Nice try though.');


UserSchema.pre('save', function(next) {
    var self = this;
    console.log(self);
    var hash = bcrypt.hashSync(self.password, 10);
    self.password = hash;
    next();
});

var model = mongoose.model('User', UserSchema);

module.exports = model;
