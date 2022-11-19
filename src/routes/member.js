const express = require('express');
const memberController = require('../controllers/member');

const router = express.Router();
const authorized = require('../middlerware/authorization/jwt');

router.get('/', authorized.admin, memberController.getAllMember);
router.get('/:id', authorized.admin, memberController.getMemberById);
router.post('/add', authorized.admin, memberController.addMember);

module.exports = router;
