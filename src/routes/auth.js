const express = require('express');
const authControllers = require('../controllers/auth');

const router = express.Router();

router.post('/api/login', authControllers.login);

module.exports = router;
