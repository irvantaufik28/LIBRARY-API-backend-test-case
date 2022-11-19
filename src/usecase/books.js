class BooksUseCase {
  constructor(booksRepository, has) {
    this._booksRepository = booksRepository;
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
    result.isSuccess = true;
    result.statusCode = 200;
    result.data = books;
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
    const availableBooks = books.filter((e) => e.stock > 0);
    let totalBooks = books.length;
    let totalAvailableBooks = await this._.sumBy(availableBooks, 'stock');
    let newBooks = {
      totalBooks,
      totalAvailableBooks,
      totalBorowedBooks: totalBooks - totalAvailableBooks,
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

    result.isSuccess = true;
    result.statusCode = 200;
    result.data = book;
    return result;
  }

  async addBooks(books) {
    let result = {
      isSuccess: false,
      statusCode: 400,
      reason: null,
      data: null,
    };
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
