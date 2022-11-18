const { BorrowDetails } = require('../models');

class BorrowDetailsRepository {
  constructor() {
    this._borrowDetails = BorrowDetails;
  }

  async getBorrowDetailsByBorrowId(borrowId) {
    const result = await this._borrowDetails.findOne({
      where: {
        borrowId,
      },
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
