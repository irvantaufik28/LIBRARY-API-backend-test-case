const { MemberloadSchema } = require('./schema');
const resData = require('../../../helper/response');

const MemberValidator = {
  validatorMember: async (req, res, next) => {
    const validationResult = MemberloadSchema.validate(req.body);

    if (validationResult.error) {
      return res.status(400).json(resData.failed(validationResult.error.details[0].message));
    }

    next();
  },
};

module.exports = MemberValidator;
