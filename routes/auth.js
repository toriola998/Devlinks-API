const express = require('express');

const router = express.Router();
const { register, login, updateUser } = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.patch('/updateUser/:id', updateUser);

module.exports = router;
