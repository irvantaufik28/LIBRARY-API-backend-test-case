const express = require('express');
const memberBooks = require('../controllers/books');

const router = express.Router();

router.get('/', memberBooks.getAllBooks);
router.get('/:id', memberBooks.getBooksById);
router.post('/add', memberBooks.addBooks);
router.put('/update/:id', memberBooks.updateBooks);
router.delete('/delete/:id', memberBooks.deleteBooks);

module.exports = router;
