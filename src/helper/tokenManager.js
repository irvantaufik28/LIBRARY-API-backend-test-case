const jwt = require('jsonwebtoken');

const generateToken = (admin) => {
  const accessToken = jwt.sign(
    admin,
    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_AGE,
    },
  );

  return accessToken;
};

module.exports = { generateToken };
