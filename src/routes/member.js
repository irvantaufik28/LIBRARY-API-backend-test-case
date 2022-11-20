const express = require('express');
const memberController = require('../controllers/member');

const router = express.Router();
const authorized = require('../middlerware/authorization/jwt');

router.get('/api/member', authorized.admin, memberController.getAllMember);
router.get('/api/member/:id', authorized.admin, memberController.getMemberById);
router.post('/api/member/add', authorized.admin, memberController.addMember);

module.exports = router;
