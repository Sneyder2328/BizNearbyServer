// @ts-ignore
import request from "supertest";
import {app, server} from "../../index";
import {wipeOutDatabase, createUser} from "../../test/setup";
import {endpoints} from "../../utils/constants/endpoints";
import {httpCodes} from "../../utils/constants/httpResponseCodes";
import {users} from "../../test/seed";
import {errors} from "../../utils/constants/errors";
import knex from "../../database/knex";

describe('POST ' + endpoints.users.SIGN_UP, () => {
    beforeEach(async () => {
        await wipeOutDatabase();
    });

    it('should sign up a new user with email', (done) => {
        request(app)
            .post(endpoints.users.SIGN_UP)
            .send({...users[0]})
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body["profile"]);
            })
            .end(done);
    });

    // it('should sign up a new user with google', (done) => {
    //     request(app)
    //         .post(endpoints.users.SIGN_UP)
    //         .send({...users[1]})
    //         .expect(httpCodes.OK)
    //         .expect(res => {
    //             expect(res.body["profile"]);
    //         })
    //         .end(done);
    // });

    // it('should sign up a new user with facebook', (done) => {
    //     request(app)
    //         .post(endpoints.users.SIGN_UP)
    //         .send({...users[2]})
    //         .expect(httpCodes.OK)
    //         .expect(res => {
    //             expect(res.body["profile"]);
    //         })
    //         .end(done);
    // });

    it('should sign up a new user with max input capacity', done => {
        request(app)
        .post(endpoints.users.SIGN_UP)
        .send({...users[7]})
        .expect(httpCodes.OK)
        .expect(res => {
            expect(res.body["profile"]);
        })
        .end(done);
    })

    it('should not sign up due to an empty password', done => {
        request(app)
            .post(endpoints.users.SIGN_UP)
            .send({...users[3]})
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done)
    })

    it('should not sign up due to name being too long', (done) => {
        request(app)
            .post(endpoints.users.SIGN_UP)
            .send({...users[4]})
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body["errors"]);
            })
            .end(done);
    });

    it('should not sign up due to phone being too long', (done) => {
        request(app)
            .post(endpoints.users.SIGN_UP)
            .send({...users[5]})
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body["errors"]);
            })
            .end(done);
    });

    it('should not sign up due to password and thumbnailURL being too long', (done) => {
        request(app)
            .post(endpoints.users.SIGN_UP)
            .send({...users[6]})
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body["errors"]);
            })
            .end(done);
    });
});

describe('POST ' + endpoints.auth.LOG_IN, () => {
    beforeAll(async ()=>{
        await wipeOutDatabase();
        await Promise.all(users.slice(0,3).map(async user => await createUser(user)));
    });

    it("should Log in with email", done=>{
        request(app)
            .post(endpoints.auth.LOG_IN)
            .send({email: users[0].email, password: users[0].password, typeLogin: users[0].typeLogin})
            .expect(httpCodes.OK)
            .expect(res=>{
                expect(res.body['profile']);
            })
            .end(done);
    });

    //it("should Log in with google", done=>{
    //    request(app)
    //        .post(endpoints.auth.LOG_IN)
    //        .send({email: users[1].email, password: users[1].password, typeLogin: users[1].typeLogin})
    //        .expect(httpCodes.OK)
    //        .expect(res=>{
    //            expect(res.body['profile']);
    //        })
    //        .end(done);
    //});

    // it("should Log in with facebook", done=>{
    //     request(app)
    //         .post(endpoints.auth.LOG_IN)
    //         .send({email: users[2].email, password: users[2].password, typeLogin: users[2].typeLogin})
    //         .expect(httpCodes.OK)
    //         .expect(res=>{
    //             expect(res.body['profile']);
    //         })
    //         .end(done);
    // });

    it('should not login due to wrong password', done=>{
        request(app)
            .post(endpoints.auth.LOG_IN)
            .send({email: users[0], password: '123', typeLogin: 'email'})
            .expect(httpCodes.NOT_FOUND)
            .expect(res=>{
                expect(res.body?.error).toBe(errors.USER_NOT_FOUND_ERROR);
                expect(res.body?.message).toBe(errors.message.USER_NOT_FOUND);
            })
            .end(done);
    });
    

    it('should not login due to wrong credentials', done=>{
        request(app)
            .post(endpoints.auth.LOG_IN)
            .send({email: "1212121212dfssdfsdf", password: '123', typeLogin: 'google'})
            .expect(httpCodes.NOT_FOUND)
            .expect(res=>{
                expect(res.body?.error).toBe(errors.USER_NOT_FOUND_ERROR);
                expect(res.body?.message).toBe(errors.message.USER_NOT_FOUND);
            })
            .end(done);
    });
})

afterAll(()=>{
    knex.destroy();
    server.close();
})