const { Op } = require('sequelize');
const { Admin } = require('../models');

class MemberRepository {
  constructor() {
    this._AdminModel = Admin;
  }

  async getUserByUsernameOrEmail(usernameOrEmail) {
    const result = await this._AdminModel.findOne({
      where: {
        [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });
    return result;
  }
}

module.exports = MemberRepository;
