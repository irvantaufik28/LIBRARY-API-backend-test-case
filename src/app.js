require('dotenv').config();

const express = require('express');
const cors = require('cors');
const has = require('lodash');
const bcrypt = require('bcrypt');
const swaggerUi = require('swagger-ui-express');
const serverError = require('./middlerware/serverError');
const func = require('./libs/function');
const tokenManager = require('./helper/tokenManager');
const memberStatus = require('./internal/constant/memberStatus');
const borrowStatus = require('./internal/constant/borrowStatus');

const app = express();

const AuthRepository = require('./repository/auth');
const MemberRepository = require('./repository/member');
const BooksRepository = require('./repository/books');
const BorrowRepository = require('./repository/borrow');
const BorrowDetailsRepository = require('./repository/borrowDetails');
const PenaltyRepository = require('./repository/penalty');
const EmailRepository = require('./repository/email');

const AuthUseCase = require('./usecase/auth');
const MemberUseCase = require('./usecase/member');
const BooksUseCase = require('./usecase/books');
const BorrowUseCase = require('./usecase/borrow');

const routerAuth = require('./routes/auth');
const routerMember = require('./routes/member');
const routerBooks = require('./routes/books');
const routerBorrow = require('./routes/borrow');

const authUC = new AuthUseCase(new AuthRepository(), bcrypt, tokenManager);
const memberUC = new MemberUseCase(new MemberRepository(), new BorrowRepository(), new BorrowDetailsRepository(), new BooksRepository(), func, memberStatus, has);
const booksUC = new BooksUseCase(new BooksRepository(), new BorrowRepository(), new BorrowDetailsRepository(), new MemberRepository(), has);
const borrowUC = new BorrowUseCase(new BorrowRepository(), new BorrowDetailsRepository(), new MemberRepository(), new BooksRepository(), new PenaltyRepository(), new EmailRepository(), borrowStatus, memberStatus, has);

app.use((req, res, next) => {
  req.authUC = authUC;
  req.memberUC = memberUC;
  req.booksUC = booksUC;
  req.borrowUC = borrowUC;
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', routerAuth);
app.use('/', routerMember);
app.use('/', routerBooks);
app.use('/', routerBorrow);

app.use(serverError);

const swaggerDocument = require('./docs/docs.json');

app.use(
  '/docs',
  swaggerUi.serveFiles(swaggerDocument),
  swaggerUi.setup(swaggerDocument),
);

module.exports = app;
