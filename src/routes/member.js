const express = require('express');
const memberController = require('../controllers/member');

const router = express.Router();

router.get('/', memberController.getAllMember);
router.get('/:id', memberController.getMemberById);
router.post('/add', memberController.addMember);

module.exports = router;
