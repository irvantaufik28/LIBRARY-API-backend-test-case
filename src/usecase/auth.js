class AuthUseCase {
  constructor(authRepository, memberRepository, bcrypt) {
    this._authRepository = authRepository;
    this._memberRepository = memberRepository;
    this._bcrypt = bcrypt;
  }

  async login(admin) {
    let result = {
      isSuccess: false,
      statusCode: 404,
      reason: null,
      data: null,
    };
    const admin = await this._authRepository.getUserByUsernameOrEmail(admin.usernameOrEmail)
    if (admin === null) {
        result.reason = 'username or password incorect'
        result.statusCode = 404
        return result
    }
  };
}

module.exports = AuthUseCase;