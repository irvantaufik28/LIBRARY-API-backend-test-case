const { Borrow } = require('../models');

class BorrowRepostiory {
  constructor() {
    this._BorrowModel = Borrow;
  }

  async getAllBorrow() {
    const result = await this._BorrowModel.findAll();
    return result;
  }

  async getBorrowByid(id) {
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
