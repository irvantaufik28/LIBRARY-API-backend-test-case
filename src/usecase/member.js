class MemberUseCase {
  constructor(memberRepository, func, memberStatus) {
    this._memberRepository = memberRepository;
    this._func = func;
    this._memberStatus = memberStatus;
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

    result.isSuccess = true;
    result.statusCode = 200;
    result.data = member;
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
    member.status = await this._memberStatus.NOT_BORROWING;

    const newMember = await this._memberRepository.addMember(member);

    result.isSuccess = true;
    result.statusCode = 201;
    result.data = newMember;
    return result;
  }
}
module.exports = MemberUseCase;
