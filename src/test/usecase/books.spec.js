require("dotenv").config();
const BooksUseCase = require("../../usecase/books");
const mockBooks = require("../mock/books.mock");

let mockBooksResult = {};
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

    booksUC = new BooksUseCase(mockBooksResult);
  });
  describe("Get all Books test", () => {
    test("should isSuccess = true statusCode = 200, and type data is array", async () => {
      let res = await booksUC.getAllBooks();

      expect(res.isSuccess).toBeTruthy();
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.data)).toBeTruthy();
      expect(res.data[0]).toHaveProperty("id");
      expect(res.data[0]).toHaveProperty("code");
      expect(res.data[0]).toHaveProperty("title");
      expect(res.data[0]).toHaveProperty("author");
      expect(res.data[0]).toHaveProperty("stock");
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
