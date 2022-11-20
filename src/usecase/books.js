class BooksUseCase {
  constructor(booksRepository, borrowRepository, borrowDetailRepository, memberRepository, has) {
    this._booksRepository = booksRepository;
    this._borrowRepository = borrowRepository;
    this._borrowDetailRepository = borrowDetailRepository;
    this._memberRepository = memberRepository;
    this._ = has;
  }

  async getAllBooks(filters) {
    let result = {
      isSuccess: true,
      statusCode: null,
      reason: null,
      data: null,
    };

    const books = await this._booksRepository.getAllBooks(filters);

    let totalTitleBooks = books.length;
    let totalBooks = await this._.sumBy(books, 'stock');
    let totalAvailableBooks = await this._.sumBy(books, 'available');
    let newBooks = {
      totalTitleBooks,
      totalBooks,
      totalAvailableBooks,
      totalBorowedBooks: await this._.sumBy(books, 'borrowed'),
      books,
    };
    result.isSuccess = true;
    result.statusCode = 200;
    result.data = newBooks;
    return result;
  }

  async getAllAvailableBooksAndQty(filters) {
    let result = {
      isSuccess: true,
      statusCode: null,
      reason: null,
      data: null,
    };

    const books = await this._booksRepository.getAllBooks(filters);
    const availableBooks = books.filter((e) => e.available !== 0);
    let totalTitleBooks = books.length;
    let totalAvailableTittleBooks = availableBooks.length;
    let newBooks = {
      totalTitleBooks,
      totalAvailableTittleBooks,
      availableBooks,
    };
    result.isSuccess = true;
    result.statusCode = 200;
    result.data = newBooks;
    return result;
  }

  async getBooksById(id) {
    let result = {
      isSuccess: false,
      statusCode: 404,
      reason: null,
      data: null,
    };

    const book = await this._booksRepository.getBooksById(id);
    if (book === null) {
      result.isSuccess = false;
      result.reason = 'book not found!';
      return result;
    }
    const borrowDetails = await this._borrowDetailRepository.getBorrowDetailsByBooksId(book.id);
    let borrowedBy = [];
    let borrow = [];
    if (borrowDetails !== null) {
      for (let i = 0; i < borrowDetails.length; i += 1) {
        borrow.push(await this._borrowRepository.getBorrowById(borrowDetails[i].borrowId));
      }
      let sumbitedBorrow = await this._.filter(borrow, ['status', 'SUMBITED']);
      for (let j = 0; j < sumbitedBorrow.length; j += 1) {
        let member = await this._memberRepository.getMemberById(sumbitedBorrow[j].memberId);
        borrowedBy.push(member);
      }
      let bookValue = {
        id: book.id,
        code: book.code,
        title: book.title,
        author: book.author,
        stock: book.stock,
        borrowed: book.borrowed,
        available: book.available,
        borrowedBy,

      };

      result.isSuccess = true;
      result.statusCode = 200;
      result.data = bookValue;
      return result;
    }
  }

  async addBooks(books) {
    let result = {
      isSuccess: false,
      statusCode: 400,
      reason: null,
      data: null,
    };
    books.available = books.stock;
    books.borrowed = 0;
    const newbooks = await this._booksRepository.addBooks(books);

    result.isSuccess = true;
    result.statusCode = 201;
    result.data = newbooks;
    return result;
  }

  async updateBooks(book, id) {
    let result = {
      isSuccess: false,
      statusCode: 404,
      reason: null,
      data: null,
    };
    const verifyBook = await this._booksRepository.getBooksById(id);
    if (verifyBook === null) {
      result.isSuccess = false;
      result.reason = 'book not found!';
      return result;
    }
    const newbooks = await this._booksRepository.updateBooks(book, id);

    result.isSuccess = true;
    result.statusCode = 200;
    result.data = newbooks;
    return result;
  }

  async deleteBooks(id) {
    let result = {
      isSuccess: false,
      statusCode: 404,
      reason: null,
      data: null,
    };
    const verifyBook = await this._booksRepository.getBooksById(id);
    if (verifyBook === null) {
      result.isSuccess = false;
      result.reason = 'book not found!';
      return result;
    }
    const newbooks = await this._booksRepository.deleteBooks(id);

    result.isSuccess = true;
    result.statusCode = 200;
    result.data = newbooks;
    return result;
  }
}
module.exports = BooksUseCase;
