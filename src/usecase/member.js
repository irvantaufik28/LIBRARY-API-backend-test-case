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

    const members = await this._memberRepository.getAllMember(filters);
    result.isSuccess = true;
    result.statusCode = 200;
    result.data = members;
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
      let borrowDetails = null;
      for (let i = 0; i < borrow.length; i += 1) {
        borrowDetails = await this._borrowDetailsRepository.getBorrowDetailsByBorrowId(borrow[i].id);
      }

      let books = await this._.map(borrowDetails, 'qty');
      let booksId = await this._.map(borrowDetails, 'booksId');
      let booksDetails = [];
      for (let i = 0; i < booksId.length; i += 1) {
        let getbook = await this._booksRepositoryRepository.getBooksById(booksId[i]);
        booksDetails.push(getbook);
      }

      const newMemberValue = {
        id: member.id,
        name: member.name,
        code: member.code,
        email: member.email,
        status: member.status,
        totalBooks: await this._.sum(books),
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
        borrowDetails,
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
