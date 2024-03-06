const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors/index');

const auth = async (req, _res, next) => {
   // check header
   const authHeader = req.headers.authorization;
   if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new UnauthenticatedError('Authentication invalid, no token provided');
   }
   const token = authHeader.split(' ')[1];

   try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      // attach the user to the routes
      req.user = { userId: payload.userId, email: payload.email };
      next();
   } catch {
      throw new UnauthenticatedError('Authentication invalid, error validating token');
   }
};

module.exports = auth;
