/* eslint-disable no-restricted-syntax */
class MemberUseCase {
  constructor(memberRepository, borrowRepository, borrowDetailsRepository, booksRepository, func, memberStatus, has) {
    this._memberRepository = memberRepository;
    this._borrowRepository = borrowRepository;
    this._borrowDetailsRepository = borrowDetailsRepository;
    this._booksRepositoryRepository = booksRepository;
    this._func = func;
    this._memberStatus = memberStatus;
    this._ = has;
  }

  async getAllMember(filters) {
    let result = {
      isSuccess: true,
      statusCode: null,
      reason: null,
      data: null,
    };

    const lists = [];
    const members = await this._memberRepository.getAllMember(filters);

    for (let member of members) {
      const data = member.dataValues;
      const borrows = await this._borrowRepository.getAllSumbitedBorrowByMemberId(data.id);

      let allBorrowDetails = [];
      for (let borrow of borrows) {
        let borrowDetails = await this._borrowDetailsRepository.getBorrowDetailsByBorrowId(borrow.id);

        for (const borrowDetail of borrowDetails) {
          allBorrowDetails.push(borrowDetail);
        }
      }

      let bookQtys = this._.map(allBorrowDetails, 'qty');

      data.borrowedBook = this._.sum(bookQtys);

      lists.push(data);
    }

    result.isSuccess = true;
    result.statusCode = 200;
    result.data = lists;
    return result;
  }

  async getMemberById(id) {
    let result = {
      isSuccess: false,
      statusCode: 404,
      reason: null,
      data: null,
    };

    const member = await this._memberRepository.getMemberById(id);
    if (member === null) {
      result.isSuccess = false;
      result.reason = 'member not found!';
      return result;
    }
    const borrow = await this._borrowRepository.getAllSumbitedBorrowByMemberId(id);

    if (borrow !== null) {
      let allBorrowDetails = [];

      for (let borr of borrow) {
        let borrowDetails = await this._borrowDetailsRepository.getBorrowDetailsByBorrowId(borr.id);

        for (const borrowDetail of borrowDetails) {
          allBorrowDetails.push(borrowDetail);
        }
      }

      let books = this._.map(allBorrowDetails, 'qty');
      let booksId = this._.map(allBorrowDetails, 'booksId');
      let booksDetails = [];
      for (let book of booksId) {
        let getbook = await this._booksRepositoryRepository.getBooksById(book);
        booksDetails.push(getbook);
      }

      const newMemberValue = {
        id: member.id,
        name: member.name,
        code: member.code,
        email: member.email,
        status: member.status,
        totalBooks: this._.sum(books),
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
        allBorrowDetails,
        borrowedBook: booksDetails,
      };

      result.isSuccess = true;
      result.statusCode = 200;
      result.data = newMemberValue;
      return result;
    }

    const memberValue = {
      id: member.id,
      name: member.name,
      code: member.code,
      email: member.email,
      status: member.status,
      totalBooks: 0,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
      borrowDetails: [],
      borrowedBook: [],
    };

    result.isSuccess = true;
    result.statusCode = 200;
    result.data = memberValue;
    return result;
  }

  async addMember(member) {
    let result = {
      isSuccess: false,
      statusCode: 400,
      reason: null,
      data: null,
    };
    // check exist Email on DataBase if email already registed status = 400 failed
    const members = await this._memberRepository.getMemberByEmail(member.email);
    if (members !== null) {
      result.reason = 'email already registerd!';
      return result;
    }
    // generate random code member
    member.code = await this._func.generateRandomCode();
    // when a member is registered for the first time, it has status NOT BORROWING
    member.isPenalty = false;

    const newMember = await this._memberRepository.addMember(member);

    result.isSuccess = true;
    result.statusCode = 201;
    result.data = newMember;
    return result;
  }
}
module.exports = MemberUseCase;
