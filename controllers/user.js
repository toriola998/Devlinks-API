const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const { NotFoundError } = require('../errors/index');

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
   updateUser,
};
