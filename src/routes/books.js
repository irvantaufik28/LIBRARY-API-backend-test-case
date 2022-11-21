const express = require('express');
const booksControllers = require('../controllers/books');

const router = express.Router();
const authorized = require('../middlerware/authorization/jwt');
const validator = require('../middlerware/validator/books');

router.get('/api/books', authorized.admin, booksControllers.getAllBooks);
router.get('/api/books/available', authorized.admin, booksControllers.getAllAvailableBooksAndQty);
router.get('/api/books/:id', authorized.admin, booksControllers.getBooksById);
router.post('/api/books/add', authorized.admin, validator.validatorBooks, booksControllers.addBooks);
router.put('/api/books/update/:id', authorized.admin, booksControllers.updateBooks);
router.delete('/api/books/delete/:id', authorized.admin, booksControllers.deleteBooks);

module.exports = router;
