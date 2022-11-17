require("dotenv").config();
const MemberUseCase = require('../../usecase/member')
const mockMember = require('../mock/member.mock')

let mockMemberResult = {}
let memberUC = null;

describe("Member test", () => {
    beforeEach(() => {
        mockMemberResult = {
            getAllMember: jest.fn([mockMember.member]),
            getMemberById: jest.fn(mockMember.member),
            getMemberByStatus: jest.fn(mockMember.member),
            addMember : jest.fn(mockMember.member),
            updateMemberStatus: jest.fn(true)
        }
       
        memberUC = new MemberUseCase(mockMemberResult)
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
            memberUC = new MemberUseCase(mockMemberResult)
            let res = await memberUC.getMemberById(1)

            expect(res.isSuccess).toBeFalsy();
            expect(res.statusCode).toEqual(404);
            expect(res.reason).toHaveProperty("member not found!");
            
        })
    })
    describe('Add Member By Id test', ()=>{
        const newMember  = {
            code: "M001",
            name: "Angga",
        }
        test("should isSuccess = true statusCode = 200, and type data is obj", async ()=>{
            let res = await memberUC.addMember(newMember)

            expect(res.isSuccess).toBeTruthy();
            expect(res.statusCode).toEqual(200);
            expect(res.data).toHaveProperty("id");
            expect(res.data).toHaveProperty("code");
            expect(res.data).toHaveProperty("name");
            expect(res.data).toHaveProperty("status");
            expect(res.data).toHaveProperty("email");
        })
    })
    test("should isSuccess = true statusCode = 400, and type data is null", async ()=>{
        let res = awaitmemberUC.addMember(newMember)

        expect(res.isSuccess).toBeFalsy();
        expect(res.statusCode).toEqual(200);
        expect(res.reason).toEqual('email is existing');
    })
})
