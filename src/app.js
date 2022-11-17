require('dotenv').config();

const express = require('express');
const cors = require('cors');
const serverError = require('./middlerware/serverError');

const app = express();

const MemberRepository = require('./repository/member');

const MemberUseCase = require('./usecase/member');

const memberUC = new MemberUseCase(new MemberRepository());
app.use((req, res, next) => {
  req.memberUC = memberUC;
  next();
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(serverError);

module.exports = app;
