const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const { BadRequestError, UnauthenticatedError } = require('../errors/index');

const register = async (req, res) => {
   const user = await User.create({ ...req.body });
   const token = user.createJWT();
   res.status(StatusCodes.CREATED).json({
      msg: 'OK',
      email: user.email,
      token,
   });
};

const login = async (req, res) => {
   const { email, password } = req.body;

   if (!email || !password) {
      throw new BadRequestError('Please provide email and password');
   }

   const user = await User.findOne({ email });

   if (!user) {
      throw new UnauthenticatedError('User does not exist'); // Invalid Credentials
   }

   const isPasswordCorrect = await user.comparePassword(password);
   if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Incorrect username or password');
   }
   const token = user.createJWT();
   res.status(StatusCodes.OK).json({
      msg: 'OK',
      email: user.email,
      token,
   });
};

module.exports = {
   register,
   login,
};
