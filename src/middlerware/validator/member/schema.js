const Joi = require('joi');

const MemberloadSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
});

module.exports = { MemberloadSchema };
