const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const { BadRequestError, UnauthenticatedError } = require('../errors/index');

// const register = async (req, res) => {
//    const user = await User.create({ ...req.body });
//    const token = user.createJWT();
//    res.status(StatusCodes.CREATED).json({
//       msg: 'OK',
//       email: user.email,
//       token,
//    });
// };

const register = async (req, res) => {
   try {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
         return res.status(StatusCodes.CONFLICT).json({ msg: 'User already exists' });
      }

      // Create a new user
      const user = await User.create({ ...req.body });
      const token = user.createJWT();
      return res.status(StatusCodes.CREATED).json({
         msg: 'OK',
         email: user.email,
         token,
      });
   } catch (error) {
     // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
   }
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
      links: user.links,
      firstName: user.firstName,
      lastName: user.lastName,
      photo: user.photo,
      colorTheme: user.profileColorTheme,
      profileEmail: user.profileEmail
   });
};

module.exports = {
   register,
   login,
};
