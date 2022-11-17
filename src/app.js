require('dotenv').config();

const express = require('express');
const cors = require('cors');
const serverError = require('./middlerware/serverError');
const func = require('./libs/function');
const memberStatus = require('./internal/constant/memberStatus');

const app = express();

const MemberRepository = require('./repository/member');
const BooksRepository = require('./repository/books');

const MemberUseCase = require('./usecase/member');
const BooksUseCase = require('./usecase/books');

const routerMember = require('./routes/member');
const routerBooks = require('./routes/books');

const memberUC = new MemberUseCase(new MemberRepository(), func, memberStatus);
const booksUC = new BooksUseCase(new BooksRepository());

app.use((req, res, next) => {
  req.memberUC = memberUC;
  req.booksUC = booksUC;
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/member', routerMember);
app.use('/api/books', routerBooks);

app.use(serverError);

module.exports = app;
