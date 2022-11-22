const { Penalty } = require('../models');

class PenaltyRepository {
  constructor() {
    this._PenaltyModel = Penalty;
  }

  async getPenaltyById(id) {
    const result = await this._PenaltyModel.findOne({
      where: {
        id,
      },
    });
    return result;
  }

  async getAllPenaltyByMemberId(memberId) {
    const result = await this._PenaltyModel.findAll({
      where: {
        memberId,
        isActive: true,
      },
    });
    return result;
  }

  async getPenaltyByMemberId(memberId) {
    const result = await this._PenaltyModel.findOne({
      where: {
        memberId,
        isActive: true,
      },
    });
    return result;
  }

  async addPenalty(penalty) {
    const result = await this._PenaltyModel.create(penalty);
    return result;
  }

  async deletePenalty(id) {
    const result = await this._PenaltyModel.destroy({
      where: {
        id,
      },
    });
    return result;
  }

  async updatePenalty(data, id) {
    const result = await this._PenaltyModel.update(data, {
      where: {
        id,
      },
    });
    return result;
  }
}

module.exports = PenaltyRepository;
