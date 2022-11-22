require("dotenv").config();
const BooksUseCase = require("../../usecase/books");
const mockBooks = require("../mock/books.mock");
const mockBorrow = require('../mock/borrow.mock')
const mockBorrowDetails = require('../mock/borrowDetails.mock')
let has = require('lodash')

// booksRepository, borrowRepository, borrowDetailRepository, memberRepository, has

let mockBooksResult, mockBorrowResult,mockBorrowDetailsResult, mockMemberResult = {};
let booksUC = null;

describe("Books test", () => {
  beforeEach(() => {
    mockBooksResult = {
      getAllBooks: jest.fn().mockReturnValue([mockBooks.books]),
      getBooksById: jest.fn().mockReturnValue(mockBooks.books),
      getBooksByStatus: jest.fn().mockReturnValue(mockBooks.books),
      addBooks: jest.fn().mockReturnValue(mockBooks.books),
      updateBooks: jest.fn().mockReturnValue(true),
      deleteBooks: jest.fn().mockReturnValue(true),
    };
    mockBorrowResult = {
      getBorrowById: jest.fn().mockReturnValue(mockBorrow.borrow)
    } 
    mockBorrowDetailsResult = {
      getBorrowDetailsByBooksId: jest.fn().mockReturnValue([mockBorrowDetails.items])
    }

    booksUC = new BooksUseCase(mockBooksResult, mockBorrowResult,mockBorrowDetailsResult, mockMemberResult, has);
  });
  describe("Get all Books test", () => {
    test("should isSuccess = true statusCode = 200, and type data is array", async () => {
      let res = await booksUC.getAllBooks();

      expect(res.isSuccess).toBeTruthy();
      expect(res.statusCode).toEqual(200);
      expect(res.data).toHaveProperty("totalTitleBooks");
      expect(res.data).toHaveProperty("totalBooks");
      expect(res.data).toHaveProperty("totalAvailableBooks");
      expect(res.data).toHaveProperty("totalBorowedBooks");
      expect(Array.isArray(res.data.books)).toBeTruthy();
      expect(res.data.books[0]).toHaveProperty("id");
      expect(res.data.books[0]).toHaveProperty("code");
      expect(res.data.books[0]).toHaveProperty("title");
      expect(res.data.books[0]).toHaveProperty("author");
      expect(res.data.books[0]).toHaveProperty("stock");
      expect(res.data.books[0]).toHaveProperty("borrowed");
      expect(res.data.books[0]).toHaveProperty("available");
    });
  });
  describe("Get all Available Books AND Qty test", () => {
    test("should isSuccess = true statusCode = 200, and type data is array", async () => {
      let res = await booksUC.getAllAvailableBooksAndQty();

      expect(res.isSuccess).toBeTruthy();
      expect(res.statusCode).toEqual(200);
      expect(res.data).toHaveProperty("totalTitleBooks");
      expect(res.data).toHaveProperty("totalAvailableTitleBooks");
      
      expect(Array.isArray(res.data.availableBooks)).toBeTruthy();
      expect(res.data.availableBooks[0]).toHaveProperty("id");
      expect(res.data.availableBooks[0]).toHaveProperty("code");
      expect(res.data.availableBooks[0]).toHaveProperty("title");
      expect(res.data.availableBooks[0]).toHaveProperty("author");
      expect(res.data.availableBooks[0]).toHaveProperty("stock");
      expect(res.data.availableBooks[0]).toHaveProperty("borrowed");
      expect(res.data.availableBooks[0]).toHaveProperty("available");
    });
  });
  describe("Get Books By Id test", () => {
    test("should isSuccess = true statusCode = 200, and type data is obj", async () => {
      let res = await booksUC.getBooksById(1);
  
      expect(res.isSuccess).toBeTruthy();
      expect(res.statusCode).toEqual(200);
      expect(res.data).toHaveProperty("id");
      expect(res.data).toHaveProperty("code");
      expect(res.data).toHaveProperty("title");
      expect(res.data).toHaveProperty("author");
      expect(res.data).toHaveProperty("stock");
    });
    test("should isSuccess = true statusCode = 200, and type data is obj", async () => {
      mockBorrowDetails.getBorrowDetailsByBooksId = jest.fn().mockReturnValue(null);
      let res = await booksUC.getBooksById(1);
      expect(res.isSuccess).toBeTruthy();
      expect(res.statusCode).toEqual(200);
      expect(res.data).toHaveProperty("id");
      expect(res.data).toHaveProperty("code");
      expect(res.data).toHaveProperty("title");
      expect(res.data).toHaveProperty("author");
      expect(res.data).toHaveProperty("stock");
    });
    
    test("should isSuccess = False statusCode = 404, and type data is null", async () => {
      mockBooksResult.getBooksById = jest.fn().mockReturnValue(null);
      booksUC = new BooksUseCase(mockBooksResult);
      let res = await booksUC.getBooksById(1);

      expect(res.isSuccess).toBeFalsy();
      expect(res.statusCode).toEqual(404);
      expect(res.reason).toEqual('book not found!');
    });
  });
  describe("Add Books test", () => {
    const newBooks = {
      id: 1,
      code: "JK-45",
      title: "Harry Potter",
      author: "J.K Rowling",
      stock: 1,
    };
    test("should isSuccess = true statusCode = 200, and type data is obj", async () => {
      mockBooksResult.getBooksByStatus = jest.fn().mockReturnValue(null);
      booksUC = new BooksUseCase(mockBooksResult);
      let res = await booksUC.addBooks(newBooks);

      expect(res.isSuccess).toBeTruthy();
      expect(res.statusCode).toEqual(201);
      expect(res.data).toHaveProperty("id");
      expect(res.data).toHaveProperty("code");
      expect(res.data).toHaveProperty("title");
      expect(res.data).toHaveProperty("author");
      expect(res.data).toHaveProperty("stock");
    });
  });
  describe("UPDATE Books test", () => {
    const newBooks = {
      id: 1,
      code: "JK-45",
      title: "Harry Potter",
      author: "J.K Rowling",
      stock: 1,
    };
    test("should isSuccess = true statusCode = 200, and type data is obj", async () => {
      let res = await booksUC.updateBooks(newBooks);

      expect(res.isSuccess).toBeTruthy();
      expect(res.statusCode).toEqual(200);
    });
    test("should isSuccess = False statusCode = 404, and type data is null", async () => {
      mockBooksResult.getBooksById = jest.fn().mockReturnValue(null);
      booksUC = new BooksUseCase(mockBooksResult);
      let res = await booksUC.updateBooks(newBooks);

      expect(res.isSuccess).toBeFalsy();
      expect(res.statusCode).toEqual(404);
      expect(res.reason).toEqual("book not found!");
    });

    test("should isSuccess = False statusCode = 400, and type data is null, cannot update stock, borrowed cannot be greater than stock", async () => {


      booksUC = ooksUC = new BooksUseCase(mockBooksResult, mockBorrowResult,mockBorrowDetailsResult, mockMemberResult, has);
      let res = await booksUC.updateBooks({stock: 0});

      expect(res.isSuccess).toBeFalsy();
      expect(res.statusCode).toEqual(400);
      expect(res.reason).toEqual("cannot update stock, borrowed cannot be greater than stock !");
    });
    test("should isSuccess = true statusCode = 200, input stock book === stock on database", async () => {
  
  
      booksUC = ooksUC = new BooksUseCase(mockBooksResult, mockBorrowResult,mockBorrowDetailsResult, mockMemberResult, has);
      let res = await booksUC.updateBooks({stock: 2});
  
      expect(res.isSuccess).toBeTruthy();
      expect(res.statusCode).toEqual(200);
    });
  });



  describe("DELETE Books test", () => {
    test("should isSuccess = true statusCode = 200, and type data is obj", async () => {
      let res = await booksUC.deleteBooks(1);

      expect(res.isSuccess).toBeTruthy();
      expect(res.statusCode).toEqual(200);
    });
    test("should isSuccess = False statusCode = 404, and type data is null", async () => {
      mockBooksResult.getBooksById = jest.fn().mockReturnValue(null);
      booksUC = new BooksUseCase(mockBooksResult);
      let res = await booksUC.deleteBooks(1);

      expect(res.isSuccess).toBeFalsy();
      expect(res.statusCode).toEqual(404);
      expect(res.reason).toEqual("book not found!");
    });
  });
});
