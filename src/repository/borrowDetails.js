const { BorrowDetails } = require('../models');

class BorrowDetailsRepository {
  constructor() {
    this._borrowDetails = BorrowDetails;
  }

  async addBorrowDetails(borrow) {
    const result = await this._borrowDetails.create(borrow);
    return result;
  }

  async getBorrowDetailsByBorrowId(borrowId) {
    const result = await this._borrowDetails.findAll({
      where: {
        borrowId,
      },
    });
    return result;
  }

  async getBorrowDetailsByBooksId(booksId) {
    const result = await this._borrowDetails.findAll({
      where: {
        booksId,
      },
    });
    return result;
  }

  async deleteBorrowDetails(id) {
    const result = await this._borrowDetails.destroy({
      where: {
        id,
      },
    });
    return result;
  }

  async updateBorrowDetails(borrow, id) {
    const result = await this._borrowDetails.update(borrow, {
      where: { id },
    });
    return result;
  }

  async getBorrowDetailsByBorrowIdAndBooksId(borrowId, booksId) {
    const result = await this._borrowDetails.findOne({
      where: {
        borrowId,
        booksId,
      },
    });
    return result;
  }
}

module.exports = BorrowDetailsRepository;
