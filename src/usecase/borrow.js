class BorrowUseCase {
  constructor(borrowRepository, borrowDetailsRepository, memberRepository) {
    this._borrowRepository = borrowRepository;
    this._borrowDetailRepository = borrowDetailsRepository;
    this._memberRepository = memberRepository;
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
}

module.exports = BorrowUseCase;
