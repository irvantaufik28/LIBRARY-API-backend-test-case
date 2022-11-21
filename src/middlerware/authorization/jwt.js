const jwt = require('jsonwebtoken');
const resData = require('../../helper/response');

function getToken(authHeader) {
  let splitHeader = authHeader.split(' ');

  if (splitHeader.length > 1) {
    return splitHeader[1];
  }

  return splitHeader[0];
}

const authorized = (authorization, isAdmin) => {
  try {
    if (authorization !== undefined && typeof authorization !== 'string') {
      return null;
    }

    let token = getToken(authorization);
    let payload = null;

    payload = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

    if (payload.isAdmin !== isAdmin) {
      return null;
    }

    const user = {
      id: payload.id,
      name: payload.name,
      username: payload.username,
      email: payload.email,
    };

    return user;
  } catch (err) {
    return null;
  }
};

const admin = (req, res, next) => {
  /*
  #swagger.security = [{
    "bearerAuth": []
  }]
  */
  const { authorization } = req.headers;
  const isAdmin = true;
  const getAuthorization = authorized(authorization, isAdmin);

  if (getAuthorization === null) {
    return res.status(401).json(resData.failed('unauthorized'));
  }

  req.user = getAuthorization;

  next();
};

module.exports = { admin };
