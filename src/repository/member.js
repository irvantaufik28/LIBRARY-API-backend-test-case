const { Member } = require('../models');

class MemberRepository {
  constructor() {
    this._MemberModel = Member;
  }

  async getAllMember() {
    const result = await this._MemberModel.findAll();
    return result;
  }

  async getMemberById(id) {
    const result = await this._MemberModel.findOne({
      where: {
        id,
      },
    });
    return result;
  }

  async getMemberByCode(code) {
    const result = await this._MemberModel.findOne({
      where: {
        code,
      },
    });
    return result;
  }

  async getMemberByEmail(email) {
    const result = await this._MemberModel.findOne({
      where: {
        email,
      },
    });
    return result;
  }

  async updateMember(member, id) {
    const result = await this._MemberModel.update(member, {
      where: {
        id,
      },
    });
    return result;
  }

  async addMember(member) {
    const result = await this._MemberModel.create(member);
    return result;
  }
}

module.exports = MemberRepository;
