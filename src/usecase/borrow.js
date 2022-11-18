class BorrowUseCase {
  constructor(
    borrowRepository,
    borrowDetailsRepository,
    memberRepository,
    booksRepository,
    borrowStatus,
    memberStatus,
    has
  ) {
    this._borrowRepository = borrowRepository;
    this._borrowDetailRepository = borrowDetailsRepository;
    this._memberRepository = memberRepository;
    this._booksRepository = booksRepository;
    this._borrowStatus = borrowStatus;
    this._memberStatus = memberStatus;
    this._ = has;
  }

  async getAllBorrow() {
    let result = {
      isSuccess: true,
      statusCode: 200,
      data: null,
    };
    const borrow = await this._borrowRepository.getAllBorrow();
    result.data = borrow;
    return result;
  }

  async getBorrowById(id) {
    let result = {
      isSuccess: false,
      statusCode: 404,
      reason: null,
      data: null,
    };
    const borrow = await this._borrowRepository.getBorrowById(id);
    if (borrow === null) {
      result.reason = 'borrow not found!';
      return result;
    }
    result.isSuccess = true;
    result.statusCode = 200;
    result.data = borrow;
    return result;
  }

  async getBorrowByMemberId(id) {
    let result = {
      isSuccess: false,
      statusCode: 404,
      reason: null,
      data: null,
    };
    const borrow = await this._borrowRepository.getBorrowByMemberId(id);
    if (borrow === null) {
      result.reason = 'borrow not found!';
      return result;
    }
    result.isSuccess = true;
    result.statusCode = 200;
    result.data = borrow;
    return result;
  }

  async addBorrow(memberId, items) {
    let result = {
      isSuccess: false,
      statusCode: 404,
      reason: null,
      data: null,
    };

    let borrow = await this._borrowRepository.getPendingBorrowByMemberId(
      memberId
    );
    if (borrow === null) {
      const newBorrow = {
        memberId,
        status: this._borrowStatus.PENDING,
      };
      borrow = await this._borrowRepository.addBorrow(newBorrow);
    }
    await this.addBorrowDetails(borrow.id, items);
    const newBorrow = await this._borrowRepository.getPendingBorrowByMemberId(
      memberId
    );
    const detailBorrow =
      await this._borrowDetailRepository.getBorrowDetailsByBorrowId(
        newBorrow.dataValues.id
      );
    const dataBorrow = {
      id: newBorrow.id,
      memberId: newBorrow.memberId,
      deadline: newBorrow.deadline,
      status: newBorrow.status,
      createdAt: newBorrow.createdAt,
      updateAt: newBorrow.updateAt,
      details: detailBorrow,
    };
    result.isSuccess = true;
    result.statusCode = 200;
    result.data = dataBorrow;
    return result;
  }

  async addBorrowDetails(borrowId, items) {
    for (let i = 0; i < items.length; i += 1) {
      if (items[i].qty < 0) {
        continue;
      }
      let book = await this._booksRepository.getBooksById(items[i].id);
      if (book !== null) {
        let { qty } = items[i];
        let borrowDetailsValue = {
          borrowId,
          booksId: book.id,
          qty,
        };

        const verifyBorrowDetail =
          await this._borrowDetailRepository.getBorrowDetailsByBorrowIdAndBooksId(
            borrowId,
            book.id
          );
        if (qty === 0) {
          await this._borrowDetailRepository.deleteBorrowDetails(
            verifyBorrowDetail.id
          );
          return;
        }
        if (verifyBorrowDetail !== null) {
          const updateBorrowDetailValue = {
            qty,
          };
          await this._borrowDetailRepository.updateBorrowDetails(
            updateBorrowDetailValue,
            verifyBorrowDetail.id
          );
        } else {
          await this._borrowDetailRepository.addBorrowDetails(
            borrowDetailsValue
          );
        }
      }
    }
  }

  async sumbitedBorrow(id) {
    let result = {
      isSuccess: false,
      statusCode: 400,
      reason: null,
    };
    const borrow = await this._borrowRepository.getBorrowByid(id);
    const statusValues = ['COMPLETED', 'CANCELED', 'SUMBITED'];
    for (let i = 0; i < statusValues.length; i += 1) {
      if (borrow.status === statusValues[i]) {
        result.reason = `cannot sumbit, status borrow is ${statusValues[i]}`;
        return result;
      }
    }
    // TODO member tidak bisa pinjam lebih dari 2 buku
    const verifyBorrowDetail = await this._borrowRepository.getSumbitedBorrowByMemberId(borrow.memberId);

    if (verifyBorrowDetail !== null) {
      const verifyBorrow = await this._borrowDetailRepository.getBorrowDetailsByBorrowId(
        verifyBorrowDetail.id,
      );
      const pendingBorrow = await this._borrowDetailRepository.getBorrowDetailsByBorrowId(
        borrow.id,
      );
      const pendingQty = this._.map(pendingBorrow, 'qty');
      const pendingTotalBooks = this._.sum(pendingQty);
      const qty = this._.map(verifyBorrow, 'qty');
      const OldtotalBooks = this._.sum(qty);

      const newTotalBooks = pendingTotalBooks + OldtotalBooks;
      if (newTotalBooks >= 2) {
        result.reason = 'Members may not borrow more than 2 books';
        return result;
      }
    }

    const member = await this._memberRepository.getMemberById(borrow.memberId);
    if (member.status === this._memberStatus.PENALTY) {
      result.reason = 'member cannot borrow, members get penalized';
      return result;
    }
    let dayToAdd = 5;
    let currentDate = new Date();
    const statusBorrowValue = {
      status: this._borrowStatus.SUMBITED,
      deadline: new Date(currentDate.getTime() + dayToAdd * 86400000),
    };
    // TODO UPDATE STOCK BOOK
    await this._borrowRepository.updateBorrow(statusBorrowValue, borrow.id);
    const statusMemberValues = {
      status: this._memberStatus.BORROW,
    };
    await this._memberRepository.updateMember(
      statusMemberValues,
      borrow.memberId,
    );

    result.isSuccess = true;
    result.statusCode = 200;
    return result;
  }
}

module.exports = BorrowUseCase;
