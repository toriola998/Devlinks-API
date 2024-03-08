require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const { NotFoundError } = require('../errors/index');

console.log(cloudinary.config().cloud_name);

const updateUser = async (req, res) => {
   const { id } = req.params;

   if (req.body.photo) {
      const photoResult = await cloudinary.uploader.upload(req.body.photo);
      req.body.photo = photoResult.secure_url;
   }

   const user = await User.findOneAndUpdate(
      { email: id },
      req.body,
      { new: true, runValidators: true, select: '-password' },
   );

   if (!user) {
      throw new NotFoundError('No user with this email');
   }
   res.status(StatusCodes.OK).json({ msg: 'OK', user });
};

const getUser = async (req, res) => {
   const { id: userID } = req.params;
   const user = await User.findOne({ email: userID }).select(`
   firstName 
   lastName 
   links
   photo
   profileEmail
   profileColorTheme`);
   if (!user) {
      throw new NotFoundError('No user with this id');
   }
   res.status(StatusCodes.OK).json({ msg: 'OK', user });
};

module.exports = {
   updateUser,
   getUser,
};
