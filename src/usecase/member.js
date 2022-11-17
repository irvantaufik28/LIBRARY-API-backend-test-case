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
  }
}
module.exports = MemberUseCase;
