var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/YourNewsUsers');

var db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

var UserSchema = mongoose.Schema({
  username: String,
  password: String,
  tags: {
    enum: ['tag']
  }
});

var User = mongoose.model('User', UserSchema);

var selectOneUser = function(username, password, callback) {
  User.findOne({username, password}, function(err, Users) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, Users);
    }
  });
};

var addUserTags = async(username, password, tags, callback) => {
  User.findOneAndUpdate({username, password}, tags, {
    new: true
  }, async(err, succ) => {
    if (err) {
      callback(err, null);
    } else {
      console.log(succ)
      if (!succ) {
        succ = new User({username, password, tags});
      }
      succ.save(function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, succ)
        }
      })
    }
  })
}

module.exports = {
  addUserTags,
  selectOneUser,
};