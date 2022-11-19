const resData = require('../helper/response');

module.exports = {
  getAllBorrow: async (req, res, next) => {
    try {
      const result = await req.borrowUC.getAllBorrow();

      return res.status(result.statusCode).json(resData.success(result.data));
    } catch (error) {
      next(error);
    }
  },

  getBorrwoById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const result = await req.borrowUC.getBorrwoById(id);

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
  getBorrowByMemberId: async (req, res, next) => {
    try {
      const { id } = req.params;

      const result = await req.borrowUC.getBorrowByMemberId(id);

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

  addBorrow: async (req, res, next) => {
    try {
      const { memberId } = req.query;
      const { items } = req.body;

      const result = await req.borrowUC.addBorrow(memberId, items);

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

  sumbitedBorrow: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await req.borrowUC.sumbitedBorrow(id);

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
  returnedBorrow: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await req.borrowUC.returnedBorrow(id);

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
