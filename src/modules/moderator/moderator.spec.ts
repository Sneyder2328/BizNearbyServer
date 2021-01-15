import request from "supertest";
import {app, server} from "../../index";
import {wipeOutDatabase, createUser, createSession} from "../../test/setup";
import {endpoints} from "../../utils/constants/endpoints";
import {httpCodes} from "../../utils/constants/httpResponseCodes";
import {admin, users, moderator} from "../../test/seed";
import {errors} from "../../utils/constants/errors";
import knex from "../../database/knex";

const userId = users[0].id;
const token = "Bearer fcd84d1f-ee2b-4636-9f61-78dc349f23e5";
const adminToken = "Bearer fcd84d1f-ee1b-4636-9f61-78dc349f23e5"

describe('POST ' + endpoints.moderator.CREATE_MODERATOR, () => {
    beforeEach(async ()=>{
        await wipeOutDatabase();
        //@ts-ignore
        await createUser({...admin});
        await createSession({token: adminToken.split(' ')[1], userId: admin[0].id});
        //@ts-ignore
        await createUser({...users[0]});
        await createSession({token: token.split(' ')[1], userId})
    })

    it('should give the role moderator to user', done => {
        request(app)
            .post(endpoints.moderator.CREATE_MODERATOR.replace(':moderatorId',userId))
            .set('authorization', adminToken)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.updated).toBe(true);
            })
            .end(done)
    })

    it('should not give the role moderator to user without authorization', done => {
        request(app)
            .post(endpoints.moderator.CREATE_MODERATOR.replace(':moderatorId',userId))
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN);
            })
            .end(done)
    });

    it('should not give the role moderator to user with an user session', done => {
        request(app)
            .post(endpoints.moderator.CREATE_MODERATOR.replace(':moderatorId',userId))
            .set('authorization', token)
            .expect(httpCodes.FORBIDDEN)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN);
            })
            .end(done)
    });

    it('should not give the role moderator to admin', done => {
        request(app)
            .post(endpoints.moderator.CREATE_MODERATOR.replace(':moderatorId',admin[0].id))
            .set('authorization', adminToken)
            .expect(httpCodes.FORBIDDEN)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN);
            })
            .end(done)
    });

})

describe('DELETE ' + endpoints.moderator.REMOVE_MODERATOR, () => {
    beforeEach(async ()=>{
        await wipeOutDatabase();
        //@ts-ignore
        await createUser({...admin});
        await createSession({token: adminToken.split(' ')[1], userId: admin[0].id});
        //@ts-ignore
        await createUser({...users[0]});
        await createSession({token: token.split(' ')[1], userId})
    })

    it('should remove the role moderator of user', done => {
        request(app)
            .delete(endpoints.moderator.CREATE_MODERATOR.replace(':moderatorId',userId))
            .set('authorization', adminToken)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.updated).toBe(true);
            })
            .end(done)
    });

    it('should not remove the role moderator of user without authorization', done => {
        request(app)
            .delete(endpoints.moderator.CREATE_MODERATOR.replace(':moderatorId',userId))
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN);
            })
            .end(done)
    });

    it('should not remove the role moderator of user with user session', done => {
        request(app)
            .delete(endpoints.moderator.CREATE_MODERATOR.replace(':moderatorId',userId))
            .set('authorization', token)
            .expect(httpCodes.FORBIDDEN)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN);
            })
            .end(done)
    });

    it('should not try to remove the role moderator of admin', done => {
        request(app)
            .delete(endpoints.moderator.CREATE_MODERATOR.replace(':moderatorId',admin[0].id))
            .set('authorization', token)
            .expect(httpCodes.FORBIDDEN)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN);
            })
            .end(done)
    });

})

afterAll(()=>{
    knex.destroy();
    server.close();
})