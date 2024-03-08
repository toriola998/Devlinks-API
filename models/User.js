const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
   email: {
      type: String,
      required: [true, 'Please provide email'],
      match: [
         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
         'Please provide a valid email',
      ],
      unique: true,
   },
   password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 6,
   },
   links: [{
      link: { type: String },
      platform: {
         name: String,
         icon: String,
      },
   }],
   photo: {
      type: String,
   },
   firstName: {
      type: String,
   },
   lastName: {
      type: String,
   },
   profileEmail: {
      type: String,
   },
   profileColorTheme: {
      type: String,
   },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
   next();
});

UserSchema.methods.createJWT = function () {
   return jwt.sign(
      /* eslint no-underscore-dangle: 0 */
      {
         userId: this._id,
         email: this.email,
      },
      process.env.JWT_SECRET,
      {
         expiresIn: process.env.JWT_LIFETIME,
      },
   );
};

UserSchema.methods.comparePassword = async function (userPassword) {
   const isMatch = await bcrypt.compare(userPassword, this.password);
   return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
