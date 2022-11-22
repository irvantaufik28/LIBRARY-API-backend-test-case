class BorrowUseCase {
  constructor(
    borrowRepository,
    borrowDetailsRepository,
    memberRepository,
    booksRepository,
    penaltyRepository,
    emailRepository,
    borrowStatus,
    memberStatus,
    has,
  ) {
    this._borrowRepository = borrowRepository;
    this._borrowDetailRepository = borrowDetailsRepository;
    this._memberRepository = memberRepository;
    this._booksRepository = booksRepository;
    this._penaltyRepository = penaltyRepository;
    this._emailRepository = emailRepository;
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
      statusCode: 400,
      reason: null,
      data: null,
    };

    if (memberId === undefined) {
      result.reason = 'please insert member';
      return result;
    }

    const member = await this._memberRepository.getMemberById(memberId);
    if (member === null) {
      result.reason = 'member not found!';
      result.statusCode = 404;
      return result;
    }

    // Check if members borrow more than 2 books
    const verifyQty = await this._.map(items, 'qty');
    const qty = this._.sum(verifyQty);
    if (qty > 2) {
      result.reason = 'Members may not borrow more than 2 books';
      return result;
    }

    // Borrowed books are not borrowed by other members
    const checkAvailableBooks = await this.checkAvailableBooks(items);
    if (!checkAvailableBooks.isSuccess) {
      result.reason = checkAvailableBooks.reason;
      return result;
    }

    let borrow = await this._borrowRepository.getPendingBorrowByMemberId(
      memberId,
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
      memberId,
    );
    const detailBorrow = await this._borrowDetailRepository.getBorrowDetailsByBorrowId(
      newBorrow.id,
    );

    const dataBorrow = {
      id: newBorrow.id,
      memberId: newBorrow.memberId,
      dayOut: newBorrow.dayOut,
      dayReturned: newBorrow.dayReturned,
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

        const verifyBorrowDetail = await this._borrowDetailRepository.getBorrowDetailsByBorrowIdAndBooksId(
          borrowId,
          book.id,
        );
        if (qty === 0) {
          await this._borrowDetailRepository.deleteBorrowDetails(
            verifyBorrowDetail.id,
          );
          return;
        }
        if (verifyBorrowDetail !== null) {
          const updateBorrowDetailValue = {
            qty,
          };
          await this._borrowDetailRepository.updateBorrowDetails(
            updateBorrowDetailValue,
            verifyBorrowDetail.id,
          );
        } else {
          await this._borrowDetailRepository.addBorrowDetails(
            borrowDetailsValue,
          );
        }
      }
    }
  }

  async checkAvailableBooks(items) {
    let result = {
      isSuccess: false,
      reason: null,
    };
    for (let i = 0; i < items.length; i += 1) {
      let book = await this._booksRepository.getBooksById(items[i].id);
      if (book === null) {
        result.reason = 'Book not found';
        return result;
      }
      let { qty } = items[i];
      let { available } = book;

      if (qty > available) {
        result.reason = `Book ${book.title} not Available`;
        return result;
      }
    }
    result.isSuccess = true;
    return result;
  }

  async sumbitedBorrow(id) {
    let result = {
      isSuccess: false,
      statusCode: 400,
      reason: null,
    };
    const borrow = await this._borrowRepository.getBorrowById(id);

    // check whether the borrow data is available

    if (borrow === null) {
      result.statusCode = 404;
      result.reason = 'borrow not found!';
      return result;
    }

    // check the data array of objects whether there are objects with PENDING status. if not there then error message & Update status borrow to CANCELED.

    const statusValues = ['COMPLETED', 'CANCELED', 'SUMBITED'];
    for (let i = 0; i < statusValues.length; i += 1) {
      if (borrow.status === statusValues[i]) {
        result.reason = `cannot sumbit, status borrow is ${statusValues[i]}`;
        return result;
      }
    }

    const verifyBorrow = await this._borrowRepository.getAllSumbitedBorrowByMemberId(
      borrow.memberId,
    );
    // Check if members borrow more than 2 books
    // checks whether the member has a borrow with the status of SUMBITED
    if (verifyBorrow !== null) {
      let sumbitedBorrow = [];

      for (let i = 0; i < verifyBorrow.length; i += 1) {
        let borrowDetails = await this._borrowDetailRepository.getBorrowDetailsByBorrowId(
          verifyBorrow[i].id,
        );
        sumbitedBorrow.push(borrowDetails[0]);
      }

      const pendingBorrow = await this._borrowDetailRepository.getBorrowDetailsByBorrowId(
        borrow.id,
      );

      const pendingQty = this._.map(pendingBorrow, 'qty');
      const pendingTotalBooks = this._.sum(pendingQty);
      const sumbitedQty = this._.map(sumbitedBorrow, 'qty');
      const sumbitedTotalBooks = this._.sum(sumbitedQty);
      const newTotalBooks = pendingTotalBooks + sumbitedTotalBooks;

      if (newTotalBooks > 2) {
        const borrowStatusValue = {
          status: this._memberStatus.CANCELED,
        };
        await this._borrowRepository.updateBorrow(borrowStatusValue, borrow.id);
        result.reason = 'Members may not borrow more than 2 books';
        return result;
      }
    }

    //   check if member status PENALTY

    const member = await this._memberRepository.getMemberById(borrow.memberId);
    const penalty = await this._penaltyRepository.getAllPenaltyByMemberId(
      member.id,
    );

    if (penalty !== null) {
      for (let i = 0; i < penalty.length; i += 1) {
        //  check expried penalty
        if (Date.parse(penalty[i].expiredAt) < Date.parse(new Date())) {
          const updatePenaltyValues = {
            isActive: false,
          };
          await this._penaltyRepository.updatePenalty(updatePenaltyValues, penalty[i].id);
        }
      }
    }

    const verifyPenaltyActive = await this._penaltyRepository.getAllPenaltyByMemberId(member.id);
    if (verifyPenaltyActive.length === 0) {
      const statusMemberValues = {
        isPenalty: false,
      };
      await this._memberRepository.updateMember(
        statusMemberValues,
        borrow.memberId,
      );
    } else {
      const borrowStatusValue = {
        status: this._memberStatus.CANCELED,
      };
      await this._borrowRepository.updateBorrow(borrowStatusValue, borrow.id);
      result.reason = 'member cannot borrow, members get penalized';
      return result;
    }

    let dayToAdd = 7;
    let currentDate = new Date();
    const statusBorrowValue = {
      status: this._borrowStatus.SUMBITED,
      deadline: new Date(currentDate.getTime() + dayToAdd * 86400000),
      dayOut: new Date(),
    };

    await this.updateAvailableAndBorrowdBooks(borrow.id, statusBorrowValue.status);
    await this._borrowRepository.updateBorrow(statusBorrowValue, borrow.id);

    result.isSuccess = true;
    result.statusCode = 200;
    return result;
  }

  async returnedBorrow(id) {
    let result = {
      isSuccess: false,
      statusCode: 400,
      reason: null,
    };
    const borrow = await this._borrowRepository.getBorrowById(id);

    // check whether the borrow data is available

    if (borrow === null) {
      result.statusCode = 404;
      result.reason = 'borrow not found!';
      return result;
    }

    // check the data array of objects whether there are objects with PENDING status. if not there then error message & Update status borrow to CANCELED.

    const statusValues = ['COMPLETED', 'CANCELED', 'PENDING'];
    for (let i = 0; i < statusValues.length; i += 1) {
      if (borrow.status === statusValues[i]) {
        result.reason = `cannot COMPLETED, status borrow is ${statusValues[i]}`;
        return result;
      }
    }

    const updateBorrowValue = {
      dayReturned: new Date(),
      status: this._borrowStatus.COMPLETED,
    };
    await this._borrowRepository.updateBorrow(updateBorrowValue, id);
    const updatedBorrow = await this._borrowRepository.getBorrowById(id);
    let dayReturnedValue = Date.parse(updatedBorrow.dayReturned);
    let deadlineValue = Date.parse(updatedBorrow.deadline);

    if (dayReturnedValue > deadlineValue) {
      let dayToAdd = 3;
      let currentDate = new Date();
      const penaltyValue = {
        memberId: updatedBorrow.memberId,
        expiredAt: new Date(currentDate.getTime() + dayToAdd * 86400000),
        isActive: true,
        borrowId: borrow.id,
      };
      await this._penaltyRepository.addPenalty(penaltyValue);

      const memberData = await this._memberRepository.getMemberById(updatedBorrow.memberId);

      // send email notif for penalty

      await this._emailRepository.sendNotificationPenalty(memberData.email, memberData);

      const memberUpdateValue = {
        isPenalty: true,
      };
      await this._memberRepository.updateMember(
        memberUpdateValue,
        updatedBorrow.memberId,
      );
    }
    await this.updateAvailableAndBorrowdBooks(id, this._borrowStatus.COMPLETED);

    result.isSuccess = true;
    result.statusCode = 200;
    return result;
  }

  async canceledBorrow(id) {
    let result = {
      isSuccess: false,
      statusCode: 400,
      reason: null,
    };
    const borrow = await this._borrowRepository.getBorrowById(id);

    // check whether the borrow data is available

    if (borrow === null) {
      result.statusCode = 404;
      result.reason = 'borrow not found!';
      return result;
    }

    // check the data array of objects whether there are objects with PENDING status. if not there then error message & Update status borrow to CANCELED.

    const statusValues = ['COMPLETED', 'CANCELED', 'SUMBITED'];
    for (let i = 0; i < statusValues.length; i += 1) {
      if (borrow.status === statusValues[i]) {
        result.reason = `cannot CANCELED, status borrow is ${statusValues[i]}`;
        return result;
      }
    }

    const updateBorrowValue = {
      status: this._borrowStatus.CANCELED,
    };
    await this._borrowRepository.updateBorrow(updateBorrowValue, id);

    result.isSuccess = true;
    result.statusCode = 200;
    return result;
  }

  async deleteBorrow(id) {
    let result = {
      isSuccess: false,
      statusCode: 400,
      reason: null,
    };
    const borrow = await this._borrowRepository.getBorrowById(id);

    // check whether the borrow data is available

    if (borrow === null) {
      result.statusCode = 404;
      result.reason = 'borrow not found!';
      return result;
    }

    // check the data array of objects whether there are objects with PENDING status. if not there then error message & Update status borrow to CANCELED.

    const statusValues = ['SUMBITED', 'COMPLETED'];
    for (let i = 0; i < statusValues.length; i += 1) {
      if (borrow.status === statusValues[i]) {
        result.reason = `cannot Delete Borrow, status borrow is ${statusValues[i]}`;
        return result;
      }
    }

    await this._borrowRepository.deleteBorrow(id);

    result.isSuccess = true;
    result.statusCode = 200;
    return result;
  }

  async updateAvailableAndBorrowdBooks(borrowId, status) {
    const borrow = await this._borrowDetailRepository.getBorrowDetailsByBorrowId(borrowId);

    for (let i = 0; i < borrow.length; i += 1) {
      let book = await this._booksRepository.getBooksById(borrow[i].booksId);

      if (status === this._borrowStatus.SUMBITED) {
        const sumbitedUpdateValue = {
          available: book.available - borrow[i].qty,
          borrowed: book.borrowed + borrow[i].qty,
        };
        await this._booksRepository.updateBooks(sumbitedUpdateValue, book.id);
      } else if (status === this._borrowStatus.COMPLETED) {
        const completedUpdateValue = {
          available: book.available + borrow[i].qty,
          borrowed: book.borrowed - borrow[i].qty,
        };
        await this._booksRepository.updateBooks(completedUpdateValue, book.id);
      }
    }
  }
}

module.exports = BorrowUseCase;
