class AuthUseCase {
  constructor(authRepository, bcrypt, tokenManager) {
    this._authRepository = authRepository;
    this._bcrypt = bcrypt;
    this._tokenManager = tokenManager;
  }

  async loginAdmin(admin) {
    let result = {
      isSuccess: false,
      statusCode: 404,
      reason: null,
      data: null,
    };
    const adminResult = await this._authRepository.getUserByUsernameOrEmail(admin.usernameOrEmail);
    if (adminResult === null) {
      result.reason = 'username or password incorect';
      result.statusCode = 404;
      return result;
    }
    const comparePassword = await this._bcrypt.compareSync(admin.password, adminResult.password);

    if (comparePassword === null) {
      result.reason = 'username and password incorrect';
      result.statusCode = 400;
      return result;
    }

    const userObj = {
      id: adminResult.id,
      name: adminResult.name,
      username: adminResult.username,
      email: adminResult.email,
      isAdmin: adminResult.isAdmin,
      token: null,
      createdAt: adminResult.createdAt,
      updatedAt: adminResult.updatedAt,
    };
    // getToken
    const tokenManager = await this._tokenManager.generateToken(userObj);
    userObj.token = tokenManager;

    result.isSuccess = true;
    result.statusCode = 200;
    result.data = userObj;

    return result;
  }
}

module.exports = AuthUseCase;
