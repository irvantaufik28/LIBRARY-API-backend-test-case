require("dotenv").config();
const MemberUseCase = require('../../usecase/member')
const mockMember = require('../mock/member.mock')
const memberStatus = require('../../internal/constant/memberStatus')

let mockMemberResult = {}
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
        func = {
            generateRandomCode : jest.fn().mockReturnValue(true)
        }
       
        memberUC = new MemberUseCase(mockMemberResult, func, memberStatus)
    })
    describe('Get all member test', () => {
        test("should isSuccess = true statusCode = 200, and type data is array", async () => {
            let res = await memberUC.getAllMember();

            expect(res.isSuccess).toBeTruthy();
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.data)).toBeTruthy();
            expect(res.data[0]).toHaveProperty("id");
            expect(res.data[0]).toHaveProperty("code");
            expect(res.data[0]).toHaveProperty("name");
            expect(res.data[0]).toHaveProperty("status");
            expect(res.data[0]).toHaveProperty("email");
        })
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
            memberUC = new MemberUseCase(mockMemberResult, func, memberStatus)
            let res = await memberUC.addMember(newMember)

            expect(res.isSuccess).toBeTruthy();
            expect(res.statusCode).toEqual(201);
            expect(res.data).toHaveProperty("id");
            expect(res.data).toHaveProperty("code");
            expect(res.data).toHaveProperty("name");
            expect(res.data).toHaveProperty("status");
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
