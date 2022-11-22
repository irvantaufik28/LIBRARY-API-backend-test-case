require("dotenv").config();
const BorrowUseCase = require("../../usecase/borrow");
const mockBorrow = require("../mock/borrow.mock");
const mockBorrowDetails = require("../mock/borrowDetails.mock");
const mockBooks = require("../mock/books.mock");
const mockMember = require("../mock/member.mock");
const mockPenalty = require("../mock/penalty.mock");
const mockEmail = require("../mock/email.mock");
const borrowStatus = require("../../internal/constant/borrowStatus");
const memberStatus = require("../../internal/constant/memberStatus");
const has = require("lodash");

let mockBorrowResult,
  mockBorrowDetailsResult,
  mockMemberResult,
  mockBooksResult,
  mockPenaltyResult,
  mockEmailResult = {};
let borrowUC = null;

describe("Borrow Test", () => {
  beforeEach(() => {
    mockBorrowResult = {
      getAllBorrow: jest.fn().mockReturnValue([mockBorrow.borrow]),
      getBorrowById: jest.fn().mockReturnValue(mockBorrow.borrow),
      getBorrowByMemberId: jest.fn().mockReturnValue(mockBorrow.borrow),
      addBorrow: jest.fn().mockReturnValue(mockBorrow.borrow),
      getAllSumbitedBorrowByMemberId: jest
        .fn()
        .mockReturnValue(mockBorrow.borrow),
      getPendingBorrowByMemberId: jest.fn().mockReturnValue(mockBorrow.borrow),
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
      getMemberById: jest.fn().mockReturnValue(mockMember.member),
      updateMember: jest.fn().mockReturnValue(mockMember.member),
    };
    mockBooksResult = {
      getBooksById: jest.fn().mockReturnValue(mockBooks.books),
      updateBooks: jest.fn().mockReturnValue(mockBooks.books),
    };
    mockPenaltyResult = {
      getAllPenaltyByMemberId: jest.fn().mockReturnValue(mockPenalty.penalty),
      deletePenalty: jest.fn().mockReturnValue(true),
      updatePenalty: jest.fn().mockReturnValue(true),
      addPenalty: jest.fn().mockReturnValue(mockPenalty.penalty),
    };

    checkAvailableBooks = {
      checkAvailableBooks: jest.fn().mockReturnValue(true),
    };
    mockEmailResult = {
      sendNotificationPenalty: jest.fn().mockReturnValue(mockEmail),
    };

    mockMember;
    borrowUC = new BorrowUseCase(
      mockBorrowResult,
      mockBorrowDetailsResult,
      mockMemberResult,
      mockBooksResult,
      mockPenaltyResult,
      mockEmailResult,
      borrowStatus,
      memberStatus,
      has,
      checkAvailableBooks
    );
  });

  // Get all borrow

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

    // get borrow by ID

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
        borrowUC = new BorrowUseCase(
          mockBorrowResult,
          mockBorrowDetails,
          mockMemberResult
        );

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

      // add borrow

      describe("add Borrow test", () => {
        test("should isSuccess = TRUE Status code = 201", async () => {
          borrowUC = new BorrowUseCase(
            mockBorrowResult,
            mockBorrowDetailsResult,
            mockMemberResult,
            mockBooksResult,
            mockPenaltyResult,
            mockEmailResult,
            borrowStatus,
            memberStatus,
            has,
            checkAvailableBooks
          );
          let res = await borrowUC.addBorrow(1, [{ id: 1, qty: 1 }]);
          expect(res.isSuccess).toBeTruthy();
          expect(res.statusCode).toEqual(200);
          expect(res.data).toHaveProperty("id");
          expect(res.data).toHaveProperty("memberId");
          expect(res.data).toHaveProperty("dayOut");
          expect(res.data).toHaveProperty("dayReturned");
          expect(res.data).toHaveProperty("deadline");
          expect(res.data).toHaveProperty("status");
          expect(Array.isArray(res.data.details)).toBeTruthy();
        });

        test("should isSuccess = false Status code = 400, message Members may not borrow more than 2 books", async () => {
          borrowUC = new BorrowUseCase(
            mockBorrowResult,
            mockBorrowDetailsResult,
            mockMemberResult,
            mockBooksResult,
            mockPenaltyResult,
            mockEmailResult,
            borrowStatus,
            memberStatus,
            has,
            checkAvailableBooks
          );
          let res = await borrowUC.addBorrow(1, [{ id: 1, qty: 3 }]);
          expect(res.isSuccess).toBeFalsy();
          expect(res.statusCode).toEqual(400);
          expect(res.reason).toEqual(
            "Members may not borrow more than 2 books"
          );
        });

        test("should isSuccess = false Status code = 400, message Members please insert member", async () => {
          borrowUC = new BorrowUseCase(
            mockBorrowResult,
            mockBorrowDetailsResult,
            mockMemberResult,
            mockBooksResult,
            mockPenaltyResult,
            mockEmailResult,
            borrowStatus,
            memberStatus,
            has,
            checkAvailableBooks
          );
          let res = await borrowUC.addBorrow(undefined, [{ id: 1, qty: 3 }]);
          expect(res.isSuccess).toBeFalsy();
          expect(res.statusCode).toEqual(400);
          expect(res.reason).toEqual("please insert member");
        });

        test("should isSuccess = false Status code = 400, member not found", async () => {
          mockMemberResult.getMemberById = jest.fn().mockReturnValue(null);

          borrowUC = new BorrowUseCase(
            mockBorrowResult,
            mockBorrowDetailsResult,
            mockMemberResult,
            mockBooksResult,
            mockPenaltyResult,
            mockEmailResult,
            borrowStatus,
            memberStatus,
            has,
            checkAvailableBooks
          );
          let res = await borrowUC.addBorrow(3, [{ id: 2, qty: 1 }]);
          expect(res.isSuccess).toBeFalsy();
          expect(res.statusCode).toEqual(404);
          expect(res.reason).toEqual("member not found!");
        });

  

        test("should isSuccess = false Status code = 400, message Members may not borrow more than 2 books", async () => {
          const books = {
            id: 3,
            title: "Twilight",
            code: "TW-11",
            author: "Stephenie Meyer",
            stock: 2,
            borrowed: 2,
            available: 0,
            createdAt: "2022-11-20T01:39:39.697Z",
            updatedAt: "2022-11-20T01:39:39.697Z",
          };

          mockBooksResult.getBooksById = jest.fn().mockReturnValue(books);

          borrowUC = new BorrowUseCase(
            mockBorrowResult,
            mockBorrowDetailsResult,
            mockMemberResult,
            mockBooksResult,
            mockPenaltyResult,
            mockEmailResult,
            borrowStatus,
            memberStatus,
            has,
            checkAvailableBooks
          );
          let res = await borrowUC.addBorrow(1, [{ id: 1, qty: 1 }]);
          expect(res.isSuccess).toBeFalsy();
          expect(res.statusCode).toEqual(400);
          expect(res.reason).toEqual("Book Twilight not Available");
          // reason Name_Book + not available
        });

        test("should isSuccess = true Status code = 200, Case if pending Borrow null", async () => {
          mockBooksResult.getPendingBorrowByMemberId = jest
            .fn()
            .mockReturnValue(null);
          mockBooksResult.addBorrow = jest
            .fn()
            .mockReturnValue({ status: "PENDING" });

          borrowUC = new BorrowUseCase(
            mockBorrowResult,
            mockBorrowDetailsResult,
            mockMemberResult,
            mockBooksResult,
            mockPenaltyResult,
            mockEmailResult,
            borrowStatus,
            memberStatus,
            has,
            checkAvailableBooks
          );
          let res = await borrowUC.addBorrow(1, [{ id: 1, qty: 1 }]);
          expect(res.isSuccess).toBeTruthy();
          expect(res.statusCode).toEqual(200);
          expect(res.data).toHaveProperty("id");
          expect(res.data).toHaveProperty("memberId");
          expect(res.data).toHaveProperty("dayOut");
          expect(res.data).toHaveProperty("dayReturned");
          expect(res.data).toHaveProperty("deadline");
          expect(res.data).toHaveProperty("status");
          expect(Array.isArray(res.data.details)).toBeTruthy();
          // reason Name_Book + not available
        });
      });
      describe("Sumbited Borrow", () => {
        const borrowValues = {
          id: 11,
          memberId: 2,
          dayOut: "null",
          dayReturned: null,
          deadline: "null",
          status: "PENDING",
          createdAt: "2022-11-10T04:51:37.022Z",
          updatedAt: "2022-11-10T04:51:37.022Z",
        };
        
        test("should isSuccess = false statusCode = 204, message borrow not found", async () => {
          mockBorrowResult.getBorrowById = jest.fn().mockReturnValue(null);
          borrowUC = new BorrowUseCase(
            mockBorrowResult,
            mockBorrowDetailsResult,
            mockMemberResult,
            mockBooksResult,
            mockPenaltyResult,
            borrowStatus,
            memberStatus,
            has
          );
          let res = await borrowUC.sumbitedBorrow(1);

          expect(res.isSuccess).toBeFalsy();
          expect(res.statusCode).toEqual(404);
          expect(res.reason).toEqual("borrow not found!");
        });
        test("should isSuccess = false statusCode = 204, message cannot sumbit, status borrow is SUMBITED", async () => {
          const borrowValues = {
            id: 11,
            memberId: 2,
            dayOut: null,
            dayReturned: null,
            deadline: null,
            status: "SUMBITED",
            createdAt: "2022-11-20T04:51:37.022Z",
            updatedAt: "2022-11-20T04:51:37.022Z",
          };
          mockBorrowResult.getBorrowById = jest
            .fn()
            .mockReturnValue(borrowValues);
          borrowUC = new BorrowUseCase(
            mockBorrowResult,
            mockBorrowDetailsResult,
            mockMemberResult,
            mockBooksResult,
            mockPenaltyResult,
            borrowStatus,
            memberStatus,
            has
          );
          let res = await borrowUC.sumbitedBorrow(1);

          expect(res.isSuccess).toBeFalsy();
          expect(res.statusCode).toEqual(400);
          expect(res.reason).toEqual(
            "cannot sumbit, status borrow is SUMBITED"
          );
        });
        test("should isSuccess = false statusCode = 204, message cannot sumbit, status borrow is CANCELED", async () => {
          const borrowValues = {
            id: 11,
            memberId: 2,
            dayOut: null,
            dayReturned: null,
            deadline: null,
            status: "CANCELED",
            createdAt: "2022-11-20T04:51:37.022Z",
            updatedAt: "2022-11-20T04:51:37.022Z",
          };
          mockBorrowResult.getBorrowById = jest
            .fn()
            .mockReturnValue(borrowValues);
          borrowUC = new BorrowUseCase(
            mockBorrowResult,
            mockBorrowDetailsResult,
            mockMemberResult,
            mockBooksResult,
            mockPenaltyResult,
            borrowStatus,
            memberStatus,
            has
          );
          let res = await borrowUC.sumbitedBorrow(1);

          expect(res.isSuccess).toBeFalsy();
          expect(res.statusCode).toEqual(400);
          expect(res.reason).toEqual(
            "cannot sumbit, status borrow is CANCELED"
          );
        });
        test("should isSuccess = false statusCode = 204, message cannot sumbit, status borrow is COMPLETED", async () => {
          const borrowValues = {
            id: 11,
            memberId: 2,
            dayOut: null,
            dayReturned: null,
            deadline: null,
            status: "COMPLETED",
            createdAt: "2022-11-20T04:51:37.022Z",
            updatedAt: "2022-11-20T04:51:37.022Z",
          };
          mockBorrowResult.getBorrowById = jest
            .fn()
            .mockReturnValue(borrowValues);
          borrowUC = new BorrowUseCase(
            mockBorrowResult,
            mockBorrowDetailsResult,
            mockMemberResult,
            mockBooksResult,
            mockPenaltyResult,
            borrowStatus,
            memberStatus,
            has
          );
          let res = await borrowUC.sumbitedBorrow(1);

          expect(res.isSuccess).toBeFalsy();
          expect(res.statusCode).toEqual(400);
          expect(res.reason).toEqual(
            "cannot sumbit, status borrow is COMPLETED"
          );
        });
        
        describe("Sumbited Borrow", () => {
          
        });
      });

      describe("Returned Borrow", () => {
        test("should isSuccess = true statusCode = borrow not found", async () => {
          mockBorrowResult.getBorrowById = jest.fn().mockReturnValue(null);
          borrowUC = new BorrowUseCase(
            mockBorrowResult,
            mockBorrowDetailsResult,
            mockMemberResult,
            mockBooksResult,
            mockPenaltyResult,
            borrowStatus,
            memberStatus,
            has
          );
          let res = await borrowUC.returnedBorrow(1);

          expect(res.isSuccess).toBeFalsy();
          expect(res.statusCode).toEqual(404);
          expect(res.reason).toEqual("borrow not found!");
        });
        test("should isSuccess = true statusCode = 200 NOT PENALTY", async () => {
          const borrowValues = {
            id: 11,
            memberId: 2,
            dayOut: "2022-11-10T04:51:37.022Z",
            dayReturned: "2022-11-11T04:51:37.022Z",
            deadline: "2022-11-12T04:51:37.022Z",
            status: "SUMBITED",
            createdAt: "2022-11-10T04:51:37.022Z",
            updatedAt: "2022-11-10T04:51:37.022Z",
          };
          mockBorrowResult.getBorrowById = jest
            .fn()
            .mockReturnValue(borrowValues);
          borrowUC = new BorrowUseCase(
            mockBorrowResult,
            mockBorrowDetailsResult,
            mockMemberResult,
            mockBooksResult,
            mockPenaltyResult,
            borrowStatus,
            memberStatus,
            has
          );
          let res = await borrowUC.returnedBorrow(borrowValues.id);

          expect(res.isSuccess).toBeTruthy();
          expect(res.statusCode).toEqual(200);
        });
        test("should isSuccess = true statusCode = 200 MEMBER HAS PENALTY", async () => {
          const borrowValues = {
            id: 11,
            memberId: 2,
            dayOut: "2022-11-10T04:51:37.022Z",
            dayReturned: "2022-11-18T04:51:37.022Z",
            deadline: "2022-11-17T04:51:37.022Z",
            status: "SUMBITED",
            createdAt: "2022-11-10T04:51:37.022Z",
            updatedAt: "2022-11-10T04:51:37.022Z",
          };
          mockBorrowResult.getBorrowById = jest
            .fn()
            .mockReturnValue(borrowValues);
          borrowUC = new BorrowUseCase(
            mockBorrowResult,
            mockBorrowDetailsResult,
            mockMemberResult,
            mockBooksResult,
            mockPenaltyResult,
            mockEmailResult,
            borrowStatus,
            memberStatus,
            has
          );
          let res = await borrowUC.returnedBorrow(borrowValues.id);

          expect(res.isSuccess).toBeTruthy();
          expect(res.statusCode).toEqual(200);
        });

        test("should isSuccess = false statusCode = 200, message Success", async () => {
          const borrowValues = {
            id: 11,
            memberId: 2,
            dayOut: "2022-11-10T04:51:37.022Z",
            dayReturned: "2022-11-16T04:51:37.022Z",
            deadline: "2022-11-17T04:51:37.022Z",
            status: "SUMBITED",
            createdAt: "2022-11-10T04:51:37.022Z",
            updatedAt: "2022-11-10T04:51:37.022Z",
          };
          mockBorrowResult.getBorrowById = jest
            .fn()
            .mockReturnValue(borrowValues);
          borrowUC = new BorrowUseCase(
            mockBorrowResult,
            mockBorrowDetailsResult,
            mockMemberResult,
            mockBooksResult,
            mockPenaltyResult,
            borrowStatus,
            memberStatus,
            has
          );
          let res = await borrowUC.returnedBorrow(1);

          expect(res.isSuccess).toBeTruthy();
          expect(res.statusCode).toEqual(200);
        });
        test("should isSuccess = false statusCode = 204, message cannot COMPLETED, status borrow is CANCELED", async () => {
          const borrowValues = {
            id: 11,
            memberId: 2,
            dayOut: null,
            dayReturned: null,
            deadline: null,
            status: "CANCELED",
            createdAt: "2022-11-10T04:51:37.022Z",
            updatedAt: "2022-11-10T04:51:37.022Z",
          };
          mockBorrowResult.getBorrowById = jest
            .fn()
            .mockReturnValue(borrowValues);
          borrowUC = new BorrowUseCase(
            mockBorrowResult,
            mockBorrowDetailsResult,
            mockMemberResult,
            mockBooksResult,
            mockPenaltyResult,
            borrowStatus,
            memberStatus,
            has
          );
          let res = await borrowUC.returnedBorrow(1);

          expect(res.isSuccess).toBeFalsy();
          expect(res.statusCode).toEqual(400);
          expect(res.reason).toEqual(
            "cannot COMPLETED, status borrow is CANCELED"
          );
        });
        test("should isSuccess = false statusCode = 204, message cannot sumbit, status borrow is COMPLETED", async () => {
          const borrowValues = {
            id: 11,
            memberId: 2,
            dayOut: "2022-11-10T04:51:37.022Z",
            dayReturned: "2022-11-16T04:51:37.022Z",
            deadline: "2022-11-17T04:51:37.022Z",
            status: "COMPLETED",
            createdAt: "2022-11-10T04:51:37.022Z",
            updatedAt: "2022-11-10T04:51:37.022Z",
          };
          mockBorrowResult.getBorrowById = jest
            .fn()
            .mockReturnValue(borrowValues);
          borrowUC = new BorrowUseCase(
            mockBorrowResult,
            mockBorrowDetailsResult,
            mockMemberResult,
            mockBooksResult,
            mockPenaltyResult,
            borrowStatus,
            memberStatus,
            has
          );
          let res = await borrowUC.returnedBorrow(1);

          expect(res.isSuccess).toBeFalsy();
          expect(res.statusCode).toEqual(400);
          expect(res.reason).toEqual(
            "cannot COMPLETED, status borrow is COMPLETED"
          );
        });

       
        describe("Sumbited Borrow", () => {

          
        });
        describe("Canceled Borrow", () => {
          const borrowValues = {
            id: 11,
            memberId: 2,
            dayOut: null,
            dayReturned: null,
            deadline: null,
            status: "PENDING",
            createdAt: "2022-11-10T04:51:37.022Z",
            updatedAt: "2022-11-10T04:51:37.022Z",
          };
          test("should isSuccess = true statusCode = 200", async () => {
            mockBorrowResult.getBorrowById = jest
              .fn()
              .mockReturnValue(borrowValues);
            borrowUC = new BorrowUseCase(
              mockBorrowResult,
              mockBorrowDetailsResult,
              mockMemberResult,
              mockBooksResult,
              mockPenaltyResult,
              mockEmailResult,
              borrowStatus,
              memberStatus,
              has
            );
            let res = await borrowUC.canceledBorrow();

            expect(res.isSuccess).toBeTruthy();
            expect(res.statusCode).toEqual(200);
          });
          test("should isSuccess = false statusCode = 200", async () => {
            const borrowValues = {
              id: 11,
              memberId: 2,
              dayOut: null,
              dayReturned: null,
              deadline: null,
              status: "COMPLETED",
              createdAt: "2022-11-10T04:51:37.022Z",
              updatedAt: "2022-11-10T04:51:37.022Z",
            };
            mockBorrowResult.getBorrowById = jest
              .fn()
              .mockReturnValue(borrowValues);
            borrowUC = new BorrowUseCase(
              mockBorrowResult,
              mockBorrowDetailsResult,
              mockMemberResult,
              mockBooksResult,
              mockPenaltyResult,
              mockEmailResult,
              borrowStatus,
              memberStatus,
              has
            );
            let res = await borrowUC.canceledBorrow();

            expect(res.isSuccess).toBeFalsy();
            expect(res.statusCode).toEqual(400);
          });
          test("should isSuccess = false statusCode = 200", async () => {
            const borrowValues = {
              id: 11,
              memberId: 2,
              dayOut: null,
              dayReturned: null,
              deadline: null,
              status: "SUMBITED",
              createdAt: "2022-11-10T04:51:37.022Z",
              updatedAt: "2022-11-10T04:51:37.022Z",
            };
            mockBorrowResult.getBorrowById = jest
              .fn()
              .mockReturnValue(borrowValues);
            borrowUC = new BorrowUseCase(
              mockBorrowResult,
              mockBorrowDetailsResult,
              mockMemberResult,
              mockBooksResult,
              mockPenaltyResult,
              mockEmailResult,
              borrowStatus,
              memberStatus,
              has
            );
            let res = await borrowUC.canceledBorrow();

            expect(res.isSuccess).toBeFalsy();
            expect(res.statusCode).toEqual(400);
          });

          test("should isSuccess = false statusCode = 200 Borrow Not found" , async () => {
           
            mockBorrowResult.getBorrowById = jest
              .fn()
              .mockReturnValue(null);
            borrowUC = new BorrowUseCase(
              mockBorrowResult,
              mockBorrowDetailsResult,
              mockMemberResult,
              mockBooksResult,
              mockPenaltyResult,
              mockEmailResult,
              borrowStatus,
              memberStatus,
              has
            );
            let res = await borrowUC.canceledBorrow();

            expect(res.isSuccess).toBeFalsy();
            expect(res.statusCode).toEqual(404);
            expect(res.reason).toEqual("borrow not found!");
          });
          test("should isSuccess = false statusCode = 200", async () => {
            const borrowValues = {
              id: 11,
              memberId: 2,
              dayOut: null,
              dayReturned: null,
              deadline: null,
              status: "CANCELED",
              createdAt: "2022-11-10T04:51:37.022Z",
              updatedAt: "2022-11-10T04:51:37.022Z",
            };
            mockBorrowResult.getBorrowById = jest
              .fn()
              .mockReturnValue(borrowValues);
            borrowUC = new BorrowUseCase(
              mockBorrowResult,
              mockBorrowDetailsResult,
              mockMemberResult,
              mockBooksResult,
              mockPenaltyResult,
              mockEmailResult,
              borrowStatus,
              memberStatus,
              has
            );
            let res = await borrowUC.canceledBorrow();

            expect(res.isSuccess).toBeFalsy();
            expect(res.statusCode).toEqual(400);
          });
          describe("Delete Borrow", () => {
            const borrowValues = {
              id: 11,
              memberId: 2,
              dayOut: null,
              dayReturned: null,
              deadline: null,
              status: "PENDING",
              createdAt: "2022-11-10T04:51:37.022Z",
              updatedAt: "2022-11-10T04:51:37.022Z",
            };
            test("should isSuccess = true statusCode = 200", async () => {
              mockBorrowResult.getBorrowById = jest
                .fn()
                .mockReturnValue(borrowValues);
              borrowUC = new BorrowUseCase(
                mockBorrowResult,
                mockBorrowDetailsResult,
                mockMemberResult,
                mockBooksResult,
                mockPenaltyResult,
                mockEmailResult,
                borrowStatus,
                memberStatus,
                has
              );
              let res = await borrowUC.deleteBorrow();

              expect(res.isSuccess).toBeTruthy();
              expect(res.statusCode).toEqual(200);
            });
          });


          
          test("should isSuccess = true statusCode = 200", async () => {
            const borrowValues = {
              id: 11,
              memberId: 2,
              dayOut: null,
              dayReturned: null,
              deadline: null,
              status: "CANCELED",
              createdAt: "2022-11-10T04:51:37.022Z",
              updatedAt: "2022-11-10T04:51:37.022Z",
            };
            mockBorrowResult.getBorrowById = jest
              .fn()
              .mockReturnValue(borrowValues);
            borrowUC = new BorrowUseCase(
              mockBorrowResult,
              mockBorrowDetailsResult,
              mockMemberResult,
              mockBooksResult,
              mockPenaltyResult,
              mockEmailResult,
              borrowStatus,
              memberStatus,
              has
            );
            let res = await borrowUC.deleteBorrow();

            expect(res.isSuccess).toBeTruthy();
            expect(res.statusCode).toEqual(200);
          });


          test("should isSuccess = true statusCode = 200 borrow not found", async () => {
            mockBorrowResult.getBorrowById = jest
              .fn()
              .mockReturnValue(null);
            borrowUC = new BorrowUseCase(
              mockBorrowResult,
              mockBorrowDetailsResult,
              mockMemberResult,
              mockBooksResult,
              mockPenaltyResult,
              mockEmailResult,
              borrowStatus,
              memberStatus,
              has
            );
            let res = await borrowUC.deleteBorrow();

            expect(res.isSuccess).toBeFalsy();
            expect(res.statusCode).toEqual(404);
            expect(res.reason).toEqual("borrow not found!");
          });
          test("should isSuccess = false statusCode = 400", async () => {
            const borrowValues = {
              id: 11,
              memberId: 2,
              dayOut: null,
              dayReturned: null,
              deadline: null,
              status: "COMPLETED",
              createdAt: "2022-11-10T04:51:37.022Z",
              updatedAt: "2022-11-10T04:51:37.022Z",
            };
            mockBorrowResult.getBorrowById = jest
              .fn()
              .mockReturnValue(borrowValues);
            borrowUC = new BorrowUseCase(
              mockBorrowResult,
              mockBorrowDetailsResult,
              mockMemberResult,
              mockBooksResult,
              mockPenaltyResult,
              mockEmailResult,
              borrowStatus,
              memberStatus,
              has
            );
            let res = await borrowUC.deleteBorrow();

            expect(res.isSuccess).toBeFalsy();
            expect(res.statusCode).toEqual(400);
          });
          test("should isSuccess = false statusCode = 400", async () => {
            const borrowValues = {
              id: 11,
              memberId: 2,
              dayOut: null,
              dayReturned: null,
              deadline: null,
              status: "SUMBITED",
              createdAt: "2022-11-10T04:51:37.022Z",
              updatedAt: "2022-11-10T04:51:37.022Z",
            };
            mockBorrowResult.getBorrowById = jest
              .fn()
              .mockReturnValue(borrowValues);
            borrowUC = new BorrowUseCase(
              mockBorrowResult,
              mockBorrowDetailsResult,
              mockMemberResult,
              mockBooksResult,
              mockPenaltyResult,
              mockEmailResult,
              borrowStatus,
              memberStatus,
              has
            );
            let res = await borrowUC.deleteBorrow();

            expect(res.isSuccess).toBeFalsy();
            expect(res.statusCode).toEqual(400);
          });
        });
      });
    });
  });
});
