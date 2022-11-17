class MemberUseCase {
  constructor(memberRepository) {
    this._memberRepository = memberRepository;
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
}
module.exports = MemberUseCase;
