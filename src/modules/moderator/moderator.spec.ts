import request from "supertest";
import {app, server} from "../../index";
import {wipeOutDatabase, createUser, createSession, wipeOutUser, modifyUserType} from "../../test/setup";
import {endpoints} from "../../utils/constants/endpoints";
import {httpCodes} from "../../utils/constants/httpResponseCodes";
import {admin, users, moderator} from "../../test/seed";
import {errors} from "../../utils/constants/errors";
import knex from "../../database/knex";
import { genUUID } from "../../utils/utils";

const userId = users[0].id;
const token = "Bearer " + genUUID();
const normalToken = "Bearer " + genUUID();
const moderatorToken = "Bearer " + genUUID();
const adminToken = "Bearer " + genUUID()

describe('POST ' + endpoints.moderator.CREATE_MODERATOR, () => {
    beforeAll(async ()=>{
        await wipeOutDatabase();
        await createUser({...admin[0]});
        await createUser({...users[1]});
        await createUser({...moderator[0]});
        await createSession({token: adminToken.split(' ')[1], userId: admin[0].id});
        await createSession({token: normalToken.split(' ')[1], userId: users[1].id});
        await createSession({token: moderatorToken.split(' ')[1], userId: moderator[0].id});
        await createUser({...users[0]});
    })

    beforeEach(async ()=>{
        await modifyUserType(users[0].id, "normal");
    })

    it('admin should give the role moderator to user', done => {
        request(app)
            .post(endpoints.moderator.CREATE_MODERATOR.replace(':userEmail',users[0].email))
            .set('authorization', adminToken)
            .expect(httpCodes.OK)
            .expect(res => {
                console.log(res.body);
                expect(res.body).toBe(true);
            })
            .end(done)
    })

    it('user should not give the role moderator to another user', done => {
        request(app)
            .post(endpoints.moderator.CREATE_MODERATOR.replace(':userEmail',users[0].email))
            .set('authorization', normalToken)
            .expect(httpCodes.FORBIDDEN)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN);
            })
            .end(done)
    })

    it('moderator should not give the role moderator to user', done => {
        request(app)
            .post(endpoints.moderator.CREATE_MODERATOR.replace(':userEmail',users[0].email))
            .set('authorization', moderatorToken)
            .expect(httpCodes.FORBIDDEN)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN);
            })
            .end(done)
    })

    it('should not give the role moderator to user without authorization', done => {
        request(app)
            .post(endpoints.moderator.CREATE_MODERATOR.replace(':userEmail',users[0].email))
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN);
            })
            .end(done)
    });

    it('should not give the role moderator to non-existent user', done => {
        request(app)
            .post(endpoints.moderator.CREATE_MODERATOR.replace(':userEmail',users[0].email+"123"))
            .set('authorization', adminToken)
            .expect(httpCodes.NOT_FOUND)
            .expect(res => {
                expect(res.body.error).toBe(errors.USER_NOT_FOUND_ERROR);
            })
            .end(done)
    });

    it('should not give the role moderator to user with an user session', done => {
        request(app)
            .post(endpoints.moderator.CREATE_MODERATOR.replace(':userEmail',users[0].email))
            .set('authorization', normalToken)
            .expect(httpCodes.FORBIDDEN)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN);
            })
            .end(done)
    });

    it('should not give the role moderator to admin', done => {
        request(app)
            .post(endpoints.moderator.CREATE_MODERATOR.replace(':userEmail',admin[0].email))
            .set('authorization', adminToken)
            .expect(httpCodes.FORBIDDEN)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN);
            })
            .end(done)
    });

})

describe('DELETE ' + endpoints.moderator.REMOVE_MODERATOR, () => {
    beforeAll(async ()=>{
        await wipeOutDatabase();
        await createUser({...admin[0]});
        await createUser({...users[1]});
        await createUser({...moderator[0]});
        await createSession({token: adminToken.split(' ')[1], userId: admin[0].id});
        await createSession({token: normalToken.split(' ')[1], userId: users[1].id});
        await createSession({token: moderatorToken.split(' ')[1], userId: moderator[0].id});
        await createUser({...users[0]});
    })

    beforeEach(async ()=>{
        await modifyUserType(users[0].id, "normal");
    })

    it('admin should remove the role moderator of user', done => {
        request(app)
            .delete(endpoints.moderator.REMOVE_MODERATOR.replace(':userEmail',users[0].email))
            .set('authorization', adminToken)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toBe(true);
            })
            .end(done)
    });

    it('user should not remove the role moderator of user', done => {
        request(app)
            .delete(endpoints.moderator.REMOVE_MODERATOR.replace(':userEmail',users[0].email))
            .set('authorization', normalToken)
            .expect(httpCodes.FORBIDDEN)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN);
            })
            .end(done)
    });

    it('moderator should not remove the role moderator of user', done => {
        request(app)
            .delete(endpoints.moderator.REMOVE_MODERATOR.replace(':userEmail',users[0].email))
            .set('authorization', moderatorToken)
            .expect(httpCodes.FORBIDDEN)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN);
            })
            .end(done)
    });

    it('should not remove the role moderator of user without authorization', done => {
        request(app)
            .delete(endpoints.moderator.REMOVE_MODERATOR.replace(':userEmail',users[0].email))
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN);
            })
            .end(done)
    });

    it('should not remove the role moderator of user with user session', done => {
        request(app)
            .delete(endpoints.moderator.REMOVE_MODERATOR.replace(':userEmail',users[0].email))
            .set('authorization', normalToken)
            .expect(httpCodes.FORBIDDEN)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN);
            })
            .end(done)
    });

    it('should not try to remove the role moderator of admin', done => {
        request(app)
            .delete(endpoints.moderator.REMOVE_MODERATOR.replace(':userEmail',admin[0].email))
            .set('authorization', adminToken)
            .expect(httpCodes.FORBIDDEN)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN);
            })
            .end(done)
    });

    it('should not give the role moderator to non-existent user', done => {
        request(app)
            .delete(endpoints.moderator.REMOVE_MODERATOR.replace(':userEmail',"example@gmail.com"))
            .set('authorization', adminToken)
            .expect(httpCodes.NOT_FOUND)
            .expect(res => {
                expect(res.body.error).toBe(errors.USER_NOT_FOUND_ERROR);
            })
            .end(done)
    });

})

afterAll(()=>{
    knex.destroy();
    server.close();
})