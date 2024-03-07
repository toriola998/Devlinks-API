const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors/index');

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
      links: user.links,
   });
};

const updateUser = async (req, res) => {
   const { id } = req.params;
   // const userId = id.split('@')[0];

   // res.send(id, userId);

   const user = await User.findOneAndUpdate(
      { email: id },
      req.body,
      { new: true, runValidators: true },
   );

   if (!user) {
      throw new NotFoundError('No user with this email');
   }
   res.status(StatusCodes.OK).json({ msg: 'OK', user });
};

module.exports = {
   register,
   login,
   updateUser,
};
