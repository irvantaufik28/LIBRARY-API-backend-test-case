const resData = require('../helper/response');

module.exports = {
  login: async (req, res, next) => {
    /*
      #swagger.tags = ['Auth']
    */
    try {
      const user = {
        usernameOrEmail: req.body.username_or_email,
        password: req.body.password,
      };

      const result = await req.authUC.loginAdmin(user);

      if (!result.isSuccess) {
        return res.status(result.statusCode).json(resData.failed(result.reason));
      }

      res.status(result.statusCode).json(resData.success(result.data));
    } catch (error) {
      next(error);
    }
  },
};
