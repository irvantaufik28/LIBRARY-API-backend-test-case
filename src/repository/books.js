const { Books } = require('../models');

class BooksRepository {
  constructor() {
    this._BooksModel = Books;
  }

  async getAllBooks() {
    const result = await this._BooksModel.findAll();
    return result;
  }

  async getBooksById(id) {
    const result = await this._BooksModel.findOne({
      where: {
        id,
      },
    });
    return result;
  }

  async getBooksByCode(code) {
    const result = await this._BooksModel.findOne({
      where: {
        code,
      },
    });
    return result;
  }

  async getBooksByStatus(status) {
    const result = await this._BooksModel.findOne({
      where: {
        status,
      },
    });
    return result;
  }

  async addBooks(member) {
    const result = await this._BooksModel.create(member);
    return result;
  }

  async updateBooks(books, id) {
    const result = await this._BooksModel.update(books, {
      where: {
        id,
      },
    });
    return result;
  }

  async deleteBooks(id) {
    const result = await this._BooksModel.destroy({
      where: {
        id,
      },
    });
    return result;
  }
}

module.exports = BooksRepository;
