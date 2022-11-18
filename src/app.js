require('dotenv').config();

const express = require('express');
const cors = require('cors');
const serverError = require('./middlerware/serverError');
const func = require('./libs/function');
const memberStatus = require('./internal/constant/memberStatus');
const borrowStatus = require('./internal/constant/borrowStatus');

const app = express();

const MemberRepository = require('./repository/member');
const BooksRepository = require('./repository/books');
const BorrowRepository = require('./repository/borrow');
const BorrowDetailsRepository = require('./repository/borrowDetails');

const MemberUseCase = require('./usecase/member');
const BooksUseCase = require('./usecase/books');
const BorrowUseCase = require('./usecase/borrow');

const routerMember = require('./routes/member');
const routerBooks = require('./routes/books');
const routerBorrow = require('./routes/borrow');

const memberUC = new MemberUseCase(new MemberRepository(), func, memberStatus);
const booksUC = new BooksUseCase(new BooksRepository());
const borrowUC = new BorrowUseCase(new BorrowRepository(), new BorrowDetailsRepository(), new MemberRepository(), new BooksRepository(), borrowStatus);

app.use((req, res, next) => {
  req.memberUC = memberUC;
  req.booksUC = booksUC;
  req.borrowUC = borrowUC;
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/member', routerMember);
app.use('/api/books', routerBooks);
app.use('/api/borrow', routerBorrow);

app.use(serverError);

module.exports = app;
