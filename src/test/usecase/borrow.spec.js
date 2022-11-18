require("dotenv").config();
const BorrowUseCase = require("../../usecase/borrow");
const mockBorrow = require("../mock/borrow.mock");
const mockBorrowDetails = require("../mock/borrowDetails.mock");
const mockMember = require("../mock/member.mock");

let mockBorrowResult,
  mockBorrowDetailsResult,
  mockMemberResult = {};
let borrowUC = null;

describe("Borrow Test", () => {
  beforeEach(() => {
    mockBorrowResult = {
      getAllBorrow: jest.fn().mockReturnValue([mockBorrow.borrow]),
      getBorrowById: jest.fn().mockReturnValue(mockBorrow.borrow),
      getBorrowByMemberId: jest.fn().mockReturnValue(mockBorrow.borrow),
      addBorrow: jest.fn().mockReturnValue(mockBorrow.borrow),
      updateBorrow: jest.fn().mockReturnValue(true),
      deleteBorrow: jest.fn().mockReturnValue(true),
    };
    mockBorrowDetailsResult = {
      getBorrowDetailsByBorrowId: jest
        .fn()
        .mockReturnValue([mockBorrowDetails.items]),
      getBorrowDetailsByBorrowIdAndBooksId: jest
        .fn()
        .mockReturnValue(mockBorrowDetails.items),
      addBorrowDetails: jest.fn().mockReturnValue(mockBorrowDetails.items),
      updateBorrowDetails: jest.fn().mockReturnValue(true),
      deleteBorrowDetails: jest.fn().mockReturnValue(true),
    };
    mockMemberResult = {
      getByMemberId: jest.fn().mockReturnValue(mockMember.member),
    };

    mockMember;
    borrowUC = new BorrowUseCase(
      mockBorrowResult,
      mockBorrowDetailsResult,
      mockMemberResult
    );
  });
  describe("getAllBorrow", () => {
    test("should isSuccess = true statusCode = 200, and type data is arrya", async () => {
      let res = await borrowUC.getAllBorrow();

      expect(res.isSuccess).toBeTruthy();
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.data)).toBeTruthy();
      expect(res.data[0]).toHaveProperty("id");
      expect(res.data[0]).toHaveProperty("memberId");
      expect(res.data[0]).toHaveProperty("deadline");
    });
    describe("getOrderById", () => {
      test("should isSuccess = true statusCode = 200, and type data is object", async () => {
        let res = await borrowUC.getBorrowById(1);
        expect(res.isSuccess).toBeTruthy();
        expect(res.statusCode).toEqual(200);
        expect(res.data).toHaveProperty("id");
        expect(res.data).toHaveProperty("memberId");
        expect(res.data).toHaveProperty("deadline");
      });
      test("should isSuccess = false StatusCode = 404 data null", async () => {
        mockBorrowResult.getBorrowById = jest.fn().mockReturnValue(null);
        borrowUC = new BorrowUseCase(mockBorrowResult, mockBorrowDetails, mockMemberResult);

        let res = await borrowUC.getBorrowById(1);

        expect(res.isSuccess).toBeFalsy();
        expect(res.statusCode).toEqual(404);
        expect(res.reason).toEqual("borrow not found!");
      });
    });
    describe("getOrderByMemberId", () => {
      test("should isSuccess = true statusCode = 200, and type data is object", async () => {
        let res = await borrowUC.getBorrowByMemberId(1);
        expect(res.isSuccess).toBeTruthy();
        expect(res.statusCode).toEqual(200);
        expect(res.data).toHaveProperty("id");
        expect(res.data).toHaveProperty("memberId");
        expect(res.data).toHaveProperty("deadline");
      });
      test("should isSuccess = false StatusCode = 404 data null and message member not found!", async () => {
        mockBorrowResult.getBorrowByMemberId = jest.fn().mockReturnValue(null);
        borrowUC = new BorrowUseCase(mockBorrowResult);

        let res = await borrowUC.getBorrowByMemberId(1);

        expect(res.isSuccess).toBeFalsy();
        expect(res.statusCode).toEqual(404);
        expect(res.reason).toEqual("borrow not found!");
      });
      describe("add Borrow test", () => {
        const newBorrow = {
          id: 1,
          memberId: 1,
          deadline: "2022-09-07 09:36:06.000 +0700",
        };
        test("should isSuccess = true Status code = 201", async () => {
          let res = await borrowUC.addBorrow(newBorrow);
          expect(res.isSuccess).toBeTruthy();
          expect(res.statusCode).toEqual(200);
          expect(res.data).toHaveProperty("id");
          expect(res.data).toHaveProperty("memberId");
          expect(res.data).toHaveProperty("deadlibe");
        });
      });
    });
  });
});
