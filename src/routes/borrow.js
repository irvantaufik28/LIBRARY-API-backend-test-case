const express = require('express');
const borrowControllers = require('../controllers/borrow');

const router = express.Router();

router.get('/', borrowControllers.getAllBorrow);
router.get('/:id', borrowControllers.getBorrwoById);
router.get('/member/:id', borrowControllers.getBorrowByMemberId);
router.post('/add', borrowControllers.addBorrow);

module.exports = router;
