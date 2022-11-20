const resData = require('../helper/response');

module.exports = {
  getAllMember: async (req, res, next) => {
    /*
      #swagger.tags = ['Member']
    */
    try {
      const result = await req.memberUC.getAllMember();

      return res.status(result.statusCode).json(resData.success(result.data));
    } catch (error) {
      next(error);
    }
  },

  getMemberById: async (req, res, next) => {
    /*
      #swagger.tags = ['Member']
    */
    try {
      const { id } = req.params;

      const result = await req.memberUC.getMemberById(id);

      if (!result.isSuccess) {
        return res
          .status(result.statusCode)
          .json(resData.failed(result.reason));
      }

      return res.status(result.statusCode).json(resData.success(result.data));
    } catch (error) {
      next(error);
    }
  },

  addMember: async (req, res, next) => {
    /*
      #swagger.tags = ['Member']
    */
    try {
      const member = {
        name: req.body.name,
        email: req.body.email,
      };

      const result = await req.memberUC.addMember(member);

      if (!result.isSuccess) {
        return res
          .status(result.statusCode)
          .json(resData.failed(result.reason));
      }

      return res.status(result.statusCode).json(resData.success(result.data));
    } catch (error) {
      next(error);
    }
  },
};
