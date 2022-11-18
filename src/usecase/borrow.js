class BorrowUseCase {
  constructor(
    borrowRepository,
    borrowDetailsRepository,
    memberRepository,
    booksRepository,
    borrowStatus,
  ) {
    this._borrowRepository = borrowRepository;
    this._borrowDetailRepository = borrowDetailsRepository;
    this._memberRepository = memberRepository;
    this._booksRepository = booksRepository;
    this._borrowStatus = borrowStatus;
  }

  async getAllBorrow() {
    let result = {
      isSuccess: true,
      statusCode: 200,
      data: null,
    };
    const borrow = await this._borrowRepository.getAllBorrow();
    result.data = borrow;
    return result;
  }

  async getBorrowById(id) {
    let result = {
      isSuccess: false,
      statusCode: 404,
      reason: null,
      data: null,
    };
    const borrow = await this._borrowRepository.getBorrowById(id);
    if (borrow === null) {
      result.reason = 'borrow not found!';
      return result;
    }
    result.isSuccess = true;
    result.statusCode = 200;
    result.data = borrow;
    return result;
  }

  async getBorrowByMemberId(id) {
    let result = {
      isSuccess: false,
      statusCode: 404,
      reason: null,
      data: null,
    };
    const borrow = await this._borrowRepository.getBorrowByMemberId(id);
    if (borrow === null) {
      result.reason = 'borrow not found!';
      return result;
    }
    result.isSuccess = true;
    result.statusCode = 200;
    result.data = borrow;
    return result;
  }

  async addBorrow(memberId, items) {
    let result = {
      isSuccess: false,
      statusCode: 404,
      reason: null,
      data: null,
    };

    let borrow = await this._borrowRepository.getPendingBorrowByMemberId(memberId);
    if (borrow === null) {
    //   let dayToAdd = 5;
    //   let currentDate = new Date();
      const newBorrow = {
        memberId,
        // deadline: new Date(currentDate.getTime() + dayToAdd * 86400000),
        status: this._borrowStatus.PENDING,
      };
      borrow = await this._borrowRepository.addBorrow(newBorrow);
    }
    await this.addBorrowDetails(borrow.id, items);
    const newBorrow = await this._borrowRepository.getPendingBorrowByMemberId(memberId);
    const detailBorrow = await this._borrowDetailRepository.getBorrowDetailsByBorrowId(newBorrow.dataValues.id);
    const dataBorrow = {
      id: newBorrow.id,
      memberId: newBorrow.memberId,
      deadline: newBorrow.deadline,
      status: newBorrow.status,
      createdAt: newBorrow.createdAt,
      updateAt: newBorrow.updateAt,
      details: detailBorrow,
    };
    result.isSuccess = true;
    result.statusCode = 200;
    result.data = dataBorrow;
    return result;
  }

  async addBorrowDetails(borrowId, items) {
    for (let i = 0; i < items.length; i += 1) {
      if (items[i].qty < 0) {
        continue;
      }
      let book = await this._booksRepository.getBooksById(items[i].id);
      if (book !== null) {
        let { qty } = items[i];
        let borrowDetailsValue = {
          borrowId,
          booksId: book.id,
          qty,
        };

        const verifyBorrowDetail = await this._borrowDetailRepository.getBorrowDetailsByBorrowIdAndBooksId(borrowId, book.id);
        if (qty === 0) {
          await this._borrowDetailRepository.deleteBorrowDetails(verifyBorrowDetail.id);
          return;
        }
        if (verifyBorrowDetail !== null) {
          const updateBorrowDetailValue = {
            qty,
          };
          await this._borrowDetailRepository.updateBorrowDetails(updateBorrowDetailValue, verifyBorrowDetail.id);
        } else {
          await this._borrowDetailRepository.addBorrowDetails(borrowDetailsValue);
        }
      }
    }
  }
}

module.exports = BorrowUseCase;
