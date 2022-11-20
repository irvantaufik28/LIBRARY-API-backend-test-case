const resData = require('../helper/response');

module.exports = {
  getAllBooks: async (req, res, next) => {
    /*
      #swagger.tags = ['Books']
    */
    try {
      const result = await req.booksUC.getAllBooks();

      return res.status(result.statusCode).json(resData.success(result.data));
    } catch (error) {
      next(error);
    }
  },

  getAllAvailableBooksAndQty: async (req, res, next) => {
    /*
      #swagger.tags = ['Books']
    */
    try {
      const result = await req.booksUC.getAllAvailableBooksAndQty();

      return res.status(result.statusCode).json(resData.success(result.data));
    } catch (error) {
      next(error);
    }
  },

  getBooksById: async (req, res, next) => {
    /*
      #swagger.tags = ['Books']
    */
    try {
      const { id } = req.params;

      const result = await req.booksUC.getBooksById(id);

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

  addBooks: async (req, res, next) => {
    /*
      #swagger.tags = ['Books']
    */
    try {
      const book = {
        title: req.body.title,
        code: req.body.code,
        author: req.body.author,
        stock: req.body.stock,
      };

      const result = await req.booksUC.addBooks(book);

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

  updateBooks: async (req, res, next) => {
    /*
      #swagger.tags = ['Books']
    */
    try {
      const { id } = req.params;
      const book = {
        title: req.body.title,
        code: req.body.code,
        author: req.body.author,
        stock: req.body.stock,
      };

      const result = await req.booksUC.updateBooks(book, id);

      if (!result.isSuccess) {
        return res
          .status(result.statusCode)
          .json(resData.failed(result.reason));
      }

      return res.status(result.statusCode).json(resData.success());
    } catch (error) {
      next(error);
    }
  },
  deleteBooks: async (req, res, next) => {
    /*
      #swagger.tags = ['Books']
    */
    try {
      const { id } = req.params;

      const result = await req.booksUC.deleteBooks(id);

      if (!result.isSuccess) {
        return res
          .status(result.statusCode)
          .json(resData.failed(result.reason));
      }

      return res.status(result.statusCode).json(resData.success());
    } catch (error) {
      next(error);
    }
  },
};
