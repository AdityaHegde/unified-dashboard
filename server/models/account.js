var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Account;

try {
  Account = mongoose.model('Account');
}
catch(e) {
  var AccountSchema = new Schema({
    account_id : {
      type : String,
      index : true,
    },
    name : {
      type : String,
      index : true,
    },
    provider : {
      type : String,
      index : true,
    },
    accessToken : String,
    refreshToken : String,
    createdAt   : {
      type    : Date,
      default : Date.now,
    },
    updatedAt   : {
      type    : Date,
    },
    user : {
      ref  : 'User',
      type : Schema.Types.ObjectId,
    },
  });
  AccountSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
  });

  Account = mongoose.model('Account', AccountSchema);
}

module.exports = Account;
