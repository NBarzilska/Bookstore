// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = Number(process.env.SALTROUNDS) || 5;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  // Add more fields as needed
}, { timestamps: { createdAt: 'created_at' } });

userSchema.methods = {
  matchPassword: function (password) {
      return bcrypt.compare(password, this.password);
  }
}

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
      bcrypt.genSalt(saltRounds, (err, salt) => {
          if (err) {
              next(err);
          }
          bcrypt.hash(this.password, salt, (err, hash) => {
              if (err) {
                  next(err);
              }
              this.password = hash;
              next();
          })
      })
      return;
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;