const express = require('express');
const borrowControllers = require('../controllers/borrow');

const router = express.Router();
const authorized = require('../middlerware/authorization/jwt');

router.get('/', authorized.admin, borrowControllers.getAllBorrow);
router.get('/:id', authorized.admin, borrowControllers.getBorrwoById);
router.get('/member/:id', authorized.admin, borrowControllers.getBorrowByMemberId);
router.post('/add', authorized.admin, borrowControllers.addBorrow);
router.patch('/sumbited/:id', authorized.admin, borrowControllers.sumbitedBorrow);

module.exports = router;
