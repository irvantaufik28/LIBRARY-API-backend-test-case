const express = require('express');
const booksControllers = require('../controllers/books');

const router = express.Router();
const authorized = require('../middlerware/authorization/jwt');

router.get('/', authorized.admin, booksControllers.getAllBooks);
router.get('/available', authorized.admin, booksControllers.getAllAvailableBooksAndQty);
router.get('/:id', authorized.admin, booksControllers.getBooksById);
router.post('/add', authorized.admin, booksControllers.addBooks);
router.put('/update/:id', authorized.admin, booksControllers.updateBooks);
router.delete('/delete/:id', authorized.admin, booksControllers.deleteBooks);

module.exports = router;
