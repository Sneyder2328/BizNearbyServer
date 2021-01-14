import request from "supertest";
import {app, server} from "../../index";
import {wipeOutDatabase, createUser, createSession} from "../../test/setup";
import {endpoints} from "../../utils/constants/endpoints";
import {httpCodes} from "../../utils/constants/httpResponseCodes";
import {admin, users, moderator} from "../../test/seed";
import {errors} from "../../utils/constants/errors";
import knex from "../../database/knex";

const token = "Bearer fcd84d1f-ee1b-4636-9f61-78dc349f23e5";
const userId = users[0].id;

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

    it('should not sign up due to invalid typeUser admin', done => {
        request(app)
            .post(endpoints.users.SIGN_UP)
            .send({...users[0], typeLogin:"admin"})
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done)
    });

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
        //@ts-ignore
        await Promise.all(users.slice(0,3).map(async user => await createUser(user)));
        //@ts-ignore
        await createUser(admin);
        //@ts-ignore
        await createUser(moderator);
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

    it('should login as an admin', done=>{
        request(app)
            .post(endpoints.auth.LOG_IN)
            .send({email: admin.email, password: admin.password, typeLogin: admin.typeLogin})
            .expect(httpCodes.OK)
            .expect(res=>{
                expect(res.body['profile']);
            })
            .end(done)
    });

    it('should login as an moderator', done=>{
        request(app)
            .post(endpoints.auth.LOG_IN)
            .send({email: moderator.email, password: moderator.password, typeLogin: moderator.typeLogin})
            .expect(httpCodes.OK)
            .expect(res=>{
                expect(res.body['profile']);
            })
            .end(done)
    })

    it('should not login due to wrong password', done=>{
        request(app)
            .post(endpoints.auth.LOG_IN)
            .send({email: users[0], password: '123', typeLogin: 'email'})
            .expect(httpCodes.NOT_FOUND)
            .expect(res=>{
                expect(res.body.error).toBe(errors.USER_NOT_FOUND_ERROR);
                expect(res.body.message).toBe(errors.message.USER_NOT_FOUND);
            })
            .end(done);
    });
    

    it('should not login due to wrong credentials', done=>{
        request(app)
            .post(endpoints.auth.LOG_IN)
            .send({email: "1212121212dfssdfsdf", password: '123', typeLogin: 'google'})
            .expect(httpCodes.NOT_FOUND)
            .expect(res=>{
                expect(res.body.error).toBe(errors.USER_NOT_FOUND_ERROR);
                expect(res.body.message).toBe(errors.message.USER_NOT_FOUND);
            })
            .end(done);
    });
})

describe('PUT ' + endpoints.users.UPDATE_PROFILE, () => {
    beforeEach(async ()=>{
        await wipeOutDatabase();
        //@ts-ignore
        await createUser({...users[0]});
        await createSession({token: token.split(' ')[1], userId });
    })

    it('should update user', done => {
        request(app)
            .put(endpoints.users.UPDATE_PROFILE.replace(':userId',users[0].id))
            .set('authorization', token)
            .send({fullname: "the mandalorean", email: "john@gmail.com", phoneNumber: "123", thumbnailUrl: users[0].thumbnailUrl, password: users[0].password})
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.profile).toStrictEqual({fullname: "the mandalorean", email: "john@gmail.com", id: users[0].id, thumbnailUrl: users[0].thumbnailUrl, typeUser: users[0].typeUser})
            })
            .end(done)
    });

    it('should not update user due to password being too short', done => {
        request(app)
            .put(endpoints.users.UPDATE_PROFILE.replace(':userId',users[0].id))
            .set('authorization', token)
            .send({fullname: "the mandalorean", email: "john@gmail.com", phoneNumber: "123", thumbnailUrl: users[0].thumbnailUrl, password: "123"})
            .expect(httpCodes.OK)
            .expect(res => {
                console.log(res.body);
                expect(res.body.errors);
            })
            .end(done)
    });
})

describe('DELETE ' + endpoints.auth.LOG_OUT, () => {

    beforeEach(async ()=>{
        await wipeOutDatabase();
        //@ts-ignore
        await createUser({...users[0]});
        await createSession({token: token.split(' ')[1], userId });
    })

    it('should logout user', done => {
        request(app)
            .delete(endpoints.auth.LOG_OUT)
            .set('authorization', token)
            .expect(httpCodes.OK)
            .expect(res=>{
                expect(res.body.logOut).toBe(true)
            })
            .end(done)
    });

    it('should not logout user due to wrong authorization token', done => {
        request(app)
            .delete(endpoints.auth.LOG_OUT)
            .set('authorization', token + "21")
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res=>{
                expect(res.body.errors)
            })
            .end(done)
    });

    it('should not logout user due to absence of a token', done => {
        request(app)
            .delete(endpoints.auth.LOG_OUT)
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res=>{
                expect(res.body.errors)
            })
            .end(done)
    });
})


afterAll(()=>{
    knex.destroy();
    server.close();
})