const Joi = require('joi');

const BooksPayloadSchema = Joi.object({
  title: Joi.string().required(),
  code: Joi.string().required(),
  author: Joi.string().required(),
  stock: Joi.number().required(),
});

module.exports = { BooksPayloadSchema };
