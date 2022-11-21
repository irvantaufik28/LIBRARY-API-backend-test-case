const { BooksPayloadSchema } = require('./schema');
const resData = require('../../../helper/response');

const BooksValidator = {
  validatorBooks: async (req, res, next) => {
    const validationResult = BooksPayloadSchema.validate(req.body);

    if (validationResult.error) {
      return res.status(400).json(resData.failed(validationResult.error.details[0].message));
    }

    next();
  },
};

module.exports = BooksValidator;
