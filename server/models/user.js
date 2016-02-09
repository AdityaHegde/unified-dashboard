var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User;
var passportLocalMongoose = require('passport-local-mongoose');

try {
  User = mongoose.model('User');
}
catch(e) {
  var UserSchema = new Schema({
    email       : {
      type   : String,
      index  : true,
      unique : true,
    },
    createdAt   : {
      type    : Date,
      default : Date.now,
    },
    updatedAt   : {
      type    : Date,
    },
  });

  UserSchema.plugin(passportLocalMongoose);
  UserSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    console.log(this);
    next();
  });

  User = mongoose.model('User', UserSchema);
}

module.exports = User;
