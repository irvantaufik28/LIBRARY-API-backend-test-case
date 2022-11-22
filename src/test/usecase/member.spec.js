require("dotenv").config();
const MemberUseCase = require('../../usecase/member')
const mockBorrow = require("../mock/borrow.mock");
const mockBorrowDetails = require("../mock/borrowDetails.mock");
const mockBooks = require('../mock/books.mock')
const mockMember = require("../mock/member.mock");
const memberStatus = require('../../internal/constant/memberStatus')
const has = require('lodash')


let mockMemberResult, mockBorrowResult, mockBorrowDetailsResult, mockBooksResult = {}
let memberUC = null;

describe("Member test", () => {
    beforeEach(() => {
        mockMemberResult = {
            getAllMember: jest.fn().mockReturnValue([mockMember.member]),
            getMemberById: jest.fn().mockReturnValue(mockMember.member),
            getMemberByEmail: jest.fn().mockReturnValue(mockMember.member),
            getMemberByStatus: jest.fn().mockReturnValue(mockMember.member),
            addMember : jest.fn().mockReturnValue(mockMember.member),
            updateMemberStatus: jest.fn().mockReturnValue(true)
        }
        mockBorrowResult = {
            getAllSumbitedBorrowByMemberId: jest.fn().mockReturnValue([mockBorrow.borrow]),
        }
        mockBorrowDetailsResult = {
            getBorrowDetailsByBorrowId: jest.fn().mockReturnValue([mockBorrowDetails.items]),
        }
        mockBooksResult = {
            getBooksById: jest.fn().mockReturnValue(mockBooks.books),
        }
        func = {
            generateRandomCode : jest.fn().mockReturnValue('M231')
        }
       
        memberUC = new MemberUseCase(mockMemberResult, mockBorrowResult, mockBorrowDetailsResult, mockBooksResult, func, memberStatus, has)
    })
    describe('Get all member test', () => {

    })
    describe('Get Member By Id test', ()=>{
        test("should isSuccess = true statusCode = 200, and type data is obj", async ()=>{
            
            let res = await memberUC.getMemberById(1)

            expect(res.isSuccess).toBeTruthy();
            expect(res.statusCode).toEqual(200);
            expect(res.data).toHaveProperty("id");
            expect(res.data).toHaveProperty("code");
            expect(res.data).toHaveProperty("name");
            expect(res.data).toHaveProperty("status");
            expect(res.data).toHaveProperty("email");
        })
        test("should isSuccess = true statusCode = 200, and type data is obj Case if borrow NUll", async ()=>{
            mockBorrowResult.getAllSumbitedBorrowByMemberId = jest.fn().mockReturnValue(null)
            let res = await memberUC.getMemberById(1)

            expect(res.isSuccess).toBeTruthy();
            expect(res.statusCode).toEqual(200);
            expect(res.data).toHaveProperty("id");
            expect(res.data).toHaveProperty("code");
            expect(res.data).toHaveProperty("name");
            expect(res.data).toHaveProperty("status");
            expect(res.data).toHaveProperty("email");
        })
        test("should isSuccess = False statusCode = 404, and type data is null", async ()=>{
            mockMemberResult.getMemberById = jest.fn().mockReturnValue(null)
            memberUC = new MemberUseCase(mockMemberResult, func, memberStatus)
            let res = await memberUC.getMemberById(1)

            expect(res.isSuccess).toBeFalsy();
            expect(res.statusCode).toEqual(404);
            expect(res.reason).toEqual("member not found!");
            
        })
    })
    describe('Add Member test', ()=>{
        const newMember  = {
            id : 1,
            code: "M001",
            name: "Angga",
            email: "angga@email.com",
            status: "borrow",
        }
        test("should isSuccess = true statusCode = 200, and type data is obj", async ()=>{
            mockMemberResult.getMemberByEmail = jest.fn().mockReturnValue(null)
            memberUC = new MemberUseCase(mockMemberResult, mockBorrowResult, mockBorrowDetailsResult, mockBooksResult, func, memberStatus, has)
            let res = await memberUC.addMember(newMember)

            expect(res.isSuccess).toBeTruthy();
            expect(res.statusCode).toEqual(201);
            expect(res.data).toHaveProperty("id");
            expect(res.data).toHaveProperty("code");
            expect(res.data).toHaveProperty("name");
            expect(res.data).toHaveProperty("isPenalty");
            expect(res.data).toHaveProperty("email");
        })
    })
    test("should isSuccess = true statusCode = 400, and type data is null", async ()=>{
        const newMember  = {
            id : 1,
            code: "M001",
            name: "Angga",
            email: "angga@email.com",
            status: "borrow",
        }
        let res = await memberUC.addMember(newMember)

        expect(res.isSuccess).toBeFalsy();
        expect(res.statusCode).toEqual(400);
        expect(res.reason).toEqual('email already registerd!');
    })
})
