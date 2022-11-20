const { Borrow } = require('../models');

class BorrowRepostiory {
  constructor() {
    this._BorrowModel = Borrow;
  }

  async getAllBorrow() {
    const result = await this._BorrowModel.findAll();
    return result;
  }

  async getBorrowById(id) {
    const result = await this._BorrowModel.findOne({
      where: { id },
    });
    return result;
  }

  async getBorrowByMemberId(memberId) {
    const result = await this._BorrowModel.findOne({
      where: { memberId },
    });
    return result;
  }

  async getPendingBorrowByMemberId(memberId) {
    const result = await this._BorrowModel.findOne({
      where: {
        memberId,
        status: 'PENDING',
      },
    });
    return result;
  }

  async getSumbitedBorrowByMemberId(memberId) {
    const result = await this._BorrowModel.findOne({
      where: {
        memberId,
        status: 'SUMBITED',
      },
    });
    return result;
  }

  async getAllSumbitedBorrowByMemberId(memberId) {
    const result = await this._BorrowModel.findAll({
      where: {
        memberId,
        status: 'SUMBITED',
      },
    });
    return result;
  }

  async addBorrow(borrow) {
    const result = await this._BorrowModel.create(borrow);
    return result;
  }

  async updateBorrow(borrow, id) {
    const result = await this._BorrowModel.update(borrow, {
      where: { id },
    });
    return result;
  }

  async deleteBorrow(id) {
    const result = await this._BorrowModel.destroy({
      where: { id },
    });
    return result;
  }
}

module.exports = BorrowRepostiory;
