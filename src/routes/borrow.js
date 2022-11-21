const express = require('express');
const borrowControllers = require('../controllers/borrow');

const router = express.Router();
const authorized = require('../middlerware/authorization/jwt');

router.get('/api/borrow', authorized.admin, borrowControllers.getAllBorrow);
router.get('/api/borrow/:id', authorized.admin, borrowControllers.getBorrwoById);
router.get('/api/borrow/member/:id', authorized.admin, borrowControllers.getBorrowByMemberId);
router.post('/api/borrow/add', authorized.admin, borrowControllers.addBorrow);
router.patch('/api/borrow/sumbited/:id', authorized.admin, borrowControllers.sumbitedBorrow);
router.patch('/api/borrow/returned/:id', authorized.admin, borrowControllers.returnedBorrow);
router.patch('/api/borrow/cancel/:id', authorized.admin, borrowControllers.canceledBorrow);
router.delete('/api/borrow/delete/:id', authorized.admin, borrowControllers.deleteBorrow);

module.exports = router;
