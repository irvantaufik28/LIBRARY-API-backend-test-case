class MemberUseCase {
  constructor(memberRepository, has) {
    this._memberRepository = memberRepository;
    this._has = has;
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
      statusCode: 404,
      reason: null,
      data: null,
    };
    const members = await this._memberRepository.getAllMember();
    for (let i = 0; i < members.length; i += 1) {
      if (members[i].email === member.email) {
        result.reason = 'member already Registed!';
        return result;
      }
    }
  }
}
module.exports = MemberUseCase;
