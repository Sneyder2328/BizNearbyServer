import request from "supertest";
import {app, server} from "../../index";
import {wipeOutDatabase, createUser, createSession, wipeOutUsers} from "../../test/setup";
import {endpoints} from "../../utils/constants/endpoints";
import {httpCodes} from "../../utils/constants/httpResponseCodes";
import {admin, users, moderator} from "../../test/seed";
import {errors} from "../../utils/constants/errors";
import knex from "../../database/knex";

const token = "Bearer fcd84d1f-ee1b-4636-9f61-78dc349f23e5";
const token2 = "Bearer fcd84d1f-ee2b-4636-9f61-78dc349f23e5";
const adminToken = "Bearer fcd84d1f-ee3b-4636-9f61-78dc349f23e5";
const admin2Token = "Bearer fcd84d1f-ee8b-4636-9f61-78dc349f23e5";
const moderatorToken = "Bearer fcd84d1f-ee5b-4636-9f61-78dc349f23e5";
const moderator2Token = "Bearer fcd84d1f-ee6b-4636-9f61-78dc349f23e5";
const userId = users[0].id;
const userId2 = users[1].id;

describe('POST ' + endpoints.users.SIGN_UP, () => {
    beforeEach(async () => {
        await wipeOutDatabase();
    });

    const user = (user) => {return {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        thumbnailUrl: user.thumbnailUrl,
        typeUser: user.typeUser
    }}

    it('should sign up a new user with email', (done) => {
        request(app)
            .post(endpoints.users.SIGN_UP)
            .send({...users[0]})
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toEqual(user(users[0]));
                expect(res.header['authorization']).toBeTruthy();
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
            expect(res.body).toEqual(user(users[7]));
            expect(res.header['authorization']).toBeTruthy();
        })
        .end(done);
    })

    it('should not sign up via email due to an empty password', done => {
        request(app)
            .post(endpoints.users.SIGN_UP)
            .send({...users[3]})
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body['errors'].length).toBeGreaterThan(0);
                expect(res.header['authorization']).toBe(undefined);
            })
            .end(done)
    })

    it('should not sign up due to name being too long', (done) => {
        request(app)
            .post(endpoints.users.SIGN_UP)
            .send({...users[4]})
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body["errors"].length).toBeGreaterThan(0);
                expect(res.header['authorization']).toBe(undefined);
            })
            .end(done);
    });

    it('should not sign up due to phone being too long', (done) => {
        request(app)
            .post(endpoints.users.SIGN_UP)
            .send({...users[5]})
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body["errors"].length).toBeGreaterThan(0);
                expect(res.header['authorization']).toBe(undefined);
            })
            .end(done);
    });

    it('should not sign up due to password and thumbnailURL being too long', (done) => {
        request(app)
            .post(endpoints.users.SIGN_UP)
            .send({...users[6]})
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body["errors"].length).toBeGreaterThan(0);
                expect(res.header['authorization']).toBe(undefined);
            })
            .end(done);
    });
});

describe('POST ' + endpoints.auth.LOG_IN, () => {
    beforeAll(async ()=>{
        await wipeOutDatabase();
        await Promise.all(users.slice(0,3).map(async user => await createUser(user)));
        await createUser(admin[0]);
        await createUser(moderator[0]);
    });

    const user = (user) => {return {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        thumbnailUrl: null,
        typeUser: user.typeUser
    }}

    it("should Log in with email", done=>{
        request(app)
            .post(endpoints.auth.LOG_IN)
            .send({email: users[0].email, password: users[0].password, typeLogin: users[0].typeLogin})
            .expect(httpCodes.OK)
            .expect(res=>{
                expect(res.body).toEqual(user(users[0]));
                expect(res.header['authorization']).toBeTruthy();
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
            .send({email: admin[0].email, password: admin[0].password, typeLogin: admin[0].typeLogin})
            .expect(httpCodes.OK)
            .expect(res=>{
                expect(res.body).toEqual(user(admin[0]));
                expect(res.header['authorization']).toBeTruthy();
            })
            .end(done)
    });

    it('should login as an moderator', done=>{
        request(app)
            .post(endpoints.auth.LOG_IN)
            .send({email: moderator[0].email, password: moderator[0].password, typeLogin: moderator[0].typeLogin})
            .expect(httpCodes.OK)
            .expect(res=>{
                expect(res.body).toEqual(user(moderator[0]));
                expect(res.header['authorization']).toBeTruthy();
            })
            .end(done)
    })

    it('should not login as an moderator with user password', done=>{
        request(app)
            .post(endpoints.auth.LOG_IN)
            .send({email: moderator[0].email, password: users[0].password, typeLogin: moderator[0].typeLogin})
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res=>{
                expect(res.body.error).toEqual(errors.CREDENTIAL);
                expect(res.header['authorization']).toBe(undefined);
            })
            .end(done)
    })

    it('should not login with wrong typeLogin', done=>{
        request(app)
            .post(endpoints.auth.LOG_IN)
            .send({email: users[0].email, password: users[0].password, typeLogin: 'facebook'})
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res=>{
                expect(res.body.error).toEqual(errors.CREDENTIAL);
                expect(res.header['authorization']).toBe(undefined);
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
                expect(res.header['authorization']).toBe(undefined);
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
                expect(res.header['authorization']).toBe(undefined);

            })
            .end(done);
    });
})

describe('PUT ' + endpoints.users.UPDATE_PROFILE, () => {
    beforeEach(async ()=>{
        await wipeOutDatabase();
        await createUser({...users[0]});
        await createUser({...users[1]});
        await createSession({token: token.split(' ')[1], userId });
        await createSession({token: token2.split(' ')[1], userId: users[1].id });
    })

    it('should update user', done => {
        request(app)
            .put(endpoints.users.UPDATE_PROFILE.replace(':userId',users[0].id))
            .set('authorization', token)
            .send({fullname: "the mandalorean", email: "john@gmail.com", phoneNumber: "123", thumbnailUrl: users[0].thumbnailUrl, password: users[0].password})
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toEqual({fullname: "the mandalorean", email: "john@gmail.com", id: users[0].id, thumbnailUrl: users[0].thumbnailUrl, typeUser: users[0].typeUser});
            })
            .end(done)
    });

    it('should update user 2', done => {
        request(app)
            .put(endpoints.users.UPDATE_PROFILE.replace(':userId',users[1].id))
            .set('authorization', token2)
            .send({fullname: "the mandalorean", email: users[1].email, phoneNumber: "123", thumbnailUrl: null, password: users[1].password})
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toEqual({fullname: "the mandalorean", email: users[1].email, id: users[1].id, thumbnailUrl: null, typeUser: users[1].typeUser});
            })
            .end(done)
    });

    it('should not update user without authorization', done => {
        request(app)
            .put(endpoints.users.UPDATE_PROFILE.replace(':userId',users[0].id))
            .send({fullname: "the mandalorean", email: "john@gmail.com", phoneNumber: "123", thumbnailUrl: users[0].thumbnailUrl, password: users[0].password})
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN)
            })
            .end(done)
    });

    it('should not update user with authorization token of another user', done => {
        request(app)
            .put(endpoints.users.UPDATE_PROFILE.replace(':userId',users[0].id))
            .set('authorization', token2)
            .send({fullname: "the mandalorean", email: "john@gmail.com", phoneNumber: "123", thumbnailUrl: users[0].thumbnailUrl, password: users[0].password})
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe(errors.CREDENTIAL)
            })
            .end(done)
    });

    it('should not update user with authorization token of admin', done => {
        request(app)
            .put(endpoints.users.UPDATE_PROFILE.replace(':userId',users[0].id))
            .set('authorization', adminToken)
            .send({fullname: "the mandalorean", email: "john@gmail.com", phoneNumber: "123", thumbnailUrl: users[0].thumbnailUrl, password: users[0].password})
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe(errors.CREDENTIAL)
            })
            .end(done)
    });

    it('should not update user with authorization token of moderator', done => {
        request(app)
            .put(endpoints.users.UPDATE_PROFILE.replace(':userId',users[0].id))
            .set('authorization', moderatorToken)
            .send({fullname: "the mandalorean", email: "john@gmail.com", phoneNumber: "123", thumbnailUrl: users[0].thumbnailUrl, password: users[0].password})
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe(errors.CREDENTIAL)
            })
            .end(done)
    });

    it('should not update user due to bad input data', done => {
        request(app)
            .put(endpoints.users.UPDATE_PROFILE.replace(':userId',users[0].id))
            .set('authorization', token)
            .send({fullname: "KFC", email: "johngmail.com", phoneNumber: "123", thumbnailUrl: users[0].thumbnailUrl, password: "123"})
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body.errors.length).toBe(3);
            })
            .end(done)
    });

    it('should not update user due to null email and fullname', done => {
        request(app)
            .put(endpoints.users.UPDATE_PROFILE.replace(':userId',users[0].id))
            .set('authorization', token)
            .send({fullname: null, email: null, phoneNumber: "123", thumbnailUrl: users[0].thumbnailUrl, password: "123"})
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body.errors.length).toBeGreaterThan(0);
            })
            .end(done)
    });
})

describe('GET ' + endpoints.users.GET_PROFILE, () => {
    beforeAll(async ()=>{
        await wipeOutDatabase();
        await createUser({...users[0]});
        await createUser({...admin[0]});
        await createUser({...moderator[0]});
        await createSession({token: token.split(' ')[1], userId });
        await createSession({token: moderatorToken.split(' ')[1], userId: moderator[0].id });
        await createSession({token: adminToken.split(' ')[1], userId: admin[0].id });
    })
    let user = (_user) => {
        let user = {};
        ['id','fullname','email','typeUser'].forEach(key => {user[key]=_user[key]})
        return user;
    };

    it('should return profile of user', done => {
        request(app)
            .get(endpoints.users.GET_PROFILE.replace(":userId", users[0].id))
            .set('authorization', token)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toMatchObject({...user(users[0]), thumbnailUrl: null});
            })
            .end(done)
    });
    
    it('should return profile of moderator', done => {
        request(app)
            .get(endpoints.users.GET_PROFILE.replace(":userId", moderator[0].id))
            .set('authorization', moderatorToken)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toMatchObject({...user(moderator[0]), thumbnailUrl: null});
            })
            .end(done)
    });
    
    it('should return profile', done => {
        request(app)
            .get(endpoints.users.GET_PROFILE.replace(":userId", admin[0].id))
            .set('authorization', adminToken)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toMatchObject({...user(admin[0]), thumbnailUrl: null});
            })
            .end(done)
    });
    
    it('should not return profile of user without authorization', done => {
        request(app)
            .get(endpoints.users.GET_PROFILE.replace(":userId", users[0].id))
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN)
            })
            .end(done)
    });
})

describe('DELETE ' + endpoints.users.DELETE_ACCOUNT, () => {
    beforeAll(async ()=>{
        await wipeOutDatabase();
        await createUser({...admin[1]});
        await createUser({...moderator[1]});
        await createSession({token: moderator2Token.split(' ')[1], userId: moderator[1].id });
        await createSession({token: admin2Token.split(' ')[1], userId: admin[1].id });
    })

    beforeEach(async ()=>{
        await wipeOutUsers([users[0].id, users[1].id, admin[0].id, moderator[0].id]);
        await createUser({...users[0]});
        await createUser({...users[1]});
        await createUser({...admin[0]});
        await createUser({...moderator[0]});
        await createSession({token: token.split(' ')[1], userId });
        await createSession({token: token2.split(' ')[1], userId: userId2 });
        await createSession({token: adminToken.split(' ')[1], userId: admin[0].id });
        await createSession({token: moderatorToken.split(' ')[1], userId: moderator[0].id });
    })

    it('should delete user by the user itself (email)', done => {
        request(app)
            .delete(endpoints.users.DELETE_ACCOUNT.replace(':userId',users[0].id))
            .set('authorization', token)
            .send({'password': users[0].password})
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.deleted).toBe(true);
            })
            .end(done)
    });

    it('should delete user by the user itself (facebook)', done => {
        request(app)
            .delete(endpoints.users.DELETE_ACCOUNT.replace(':userId',users[1].id))
            .set('authorization', token2)
            .send({'password': users[1].password})
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.deleted).toBe(true);
            })
            .end(done)
    });

    it('moderator should delete itself', done => {
        request(app)
            .delete(endpoints.users.DELETE_ACCOUNT.replace(':userId',moderator[0].id))
            .set('authorization', moderatorToken)
            .send({'password': moderator[0].password})
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.deleted).toBe(true);
            })
            .end(done)
    });

    it('admin should delete itself', done => {
        request(app)
            .delete(endpoints.users.DELETE_ACCOUNT.replace(':userId',admin[0].id))
            .set('authorization', adminToken)
            .send({'password': admin[0].password})
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.deleted).toBe(true);
            })
            .end(done)
    });

    it('should delete user by moderator', done => {
        request(app)
            .delete(endpoints.users.DELETE_ACCOUNT.replace(':userId',users[0].id))
            .set('authorization', moderator2Token)
            .send({'password': moderator[1].password})
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.deleted).toBe(true);
            })
            .end(done)
    });

    it('should delete user by admin', done => {
        request(app)
            .delete(endpoints.users.DELETE_ACCOUNT.replace(':userId',users[0].id))
            .set('authorization', admin2Token)
            .send({'password': admin[1].password})
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.deleted).toBe(true);
            })
            .end(done)
    });

    it('should delete user by admin', done => {
        request(app)
            .delete(endpoints.users.DELETE_ACCOUNT.replace(':userId',users[0].id))
            .set('authorization', admin2Token)
            .send({'password': admin[1].password})
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.deleted).toBe(true);
            })
            .end(done)
    });

    it('should not delete user without authorization', done => {
        request(app)
            .delete(endpoints.users.DELETE_ACCOUNT.replace(':userId',users[1].id))
            .send({'password': users[1].password})
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.errors);
            })
            .end(done)
    });

    it('should not delete user with a wrong password', done => {
        request(app)
            .delete(endpoints.users.DELETE_ACCOUNT.replace(':userId',users[0].id))
            .set('authorization', token)
            .send({'password': users[0].password + "1"})
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe(errors.CREDENTIAL);
            })
            .end(done)
    });

    it("admin should not delete user while using user's password", done => {
        request(app)
            .delete(endpoints.users.DELETE_ACCOUNT.replace(':userId',users[0].id))
            .set('authorization', admin2Token)
            .send({'password': users[1].password})
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe(errors.CREDENTIAL);
            })
            .end(done)
    });

    it('should not delete user due to the abcense of password', done => {
        request(app)
            .delete(endpoints.users.DELETE_ACCOUNT.replace(':userId',users[0].id))
            .set('authorization', token2)
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body);
            })
            .end(done)
    });

    it("should not delete user by user2 with user2's password", done => {
        request(app)
            .delete(endpoints.users.DELETE_ACCOUNT.replace(':userId',users[0].id))
            .set('authorization', token2)
            .send({'password': users[1].password})
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body);
            })
            .end(done)
    });

    it("should not delete user by user2 with user'a password", done => {
        request(app)
            .delete(endpoints.users.DELETE_ACCOUNT.replace(':userId',users[0].id))
            .set('authorization', token2)
            .send({'password': users[1].password})
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body);
            })
            .end(done)
    });

    it('moderator should not delete another moderator', done => {
        request(app)
            .delete(endpoints.users.DELETE_ACCOUNT.replace(':userId',moderator[0].id))
            .set('authorization', moderator2Token)
            .send({'password': moderator[1].password})
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN);
            })
            .end(done)
    });

    it('moderator should not delete admin', done => {
        request(app)
            .delete(endpoints.users.DELETE_ACCOUNT.replace(':userId',admin[0].id))
            .set('authorization', moderator2Token)
            .send({'password': moderator[1].password})
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN);
            })
            .end(done)
    });

    it('admin should not delete another admin', done => {
        request(app)
            .delete(endpoints.users.DELETE_ACCOUNT.replace(':userId',admin[0].id))
            .set('authorization', admin2Token)
            .send({'password': admin[1].password})
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN);
            })
            .end(done)
    });
})

describe('DELETE' + endpoints.DELETE_USERS, ()=>{
    beforeAll(async ()=>{
        await wipeOutDatabase();
        await createUser({...admin[0]});
        await createUser({...admin[1]});
        await createSession({token: adminToken.split(' ')[1], userId: admin[0].id });
    })

    beforeEach(async ()=>{
        await wipeOutUsers([users[0].id, users[1].id, moderator[1].id, moderator[0].id]);
        await createUser({...users[0]});
        await createUser({...users[1]});
        await createUser({...moderator[1]});
        await createSession({token: token.split(' ')[1], userId });
        await createUser({...moderator[0]});
        await createSession({token: moderatorToken.split(' ')[1], userId: moderator[0].id });
    })

    it('should delete 2 normal users by moderator', done => {
        request(app)
            .delete(endpoints.DELETE_USERS)
            .set('authorization', moderatorToken)
            .send({password: moderator[0].password, userIds: [users[0].id, users[1].id]})
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.usersDeleted).toEqual(([{updated: true}, {updated: true}]))
            })
            .end(done)
    });

    it('should delete 1 normal user by admin', done => {
        request(app)
            .delete(endpoints.DELETE_USERS)
            .set('authorization', adminToken)
            .send({password: admin[0].password, userIds: [users[1].id]})
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.usersDeleted).toEqual([{updated: true}])
            })
            .end(done)
    });

    it('should delete 1 moderator by admin', done => {
        request(app)
            .delete(endpoints.DELETE_USERS)
            .set('authorization', adminToken)
            .send({password: admin[0].password, userIds: [moderator[1].id]})
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.usersDeleted).toEqual([{updated: true}])
            })
            .end(done)
    });

    it('admin should delete moderator and user', done => {
        request(app)
            .delete(endpoints.DELETE_USERS)
            .set('authorization', adminToken)
            .send({password: admin[0].password, userIds: [users[0].id,moderator[1].id]})
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.usersDeleted).toEqual([{updated: true}, {updated: true}])
            })
            .end(done)
    });

    it('should delete if the list of ids has a non-existing userId', done => {
        request(app)
            .delete(endpoints.DELETE_USERS)
            .set('authorization', adminToken)
            .send({password: admin[0].password, userIds: [users[1].id,'123']})
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.usersDeleted).toEqual([{updated: true}, {updated: false}])
            })
            .end(done)
    });

    it('normal user should not delete any user', done => {
        request(app)
            .delete(endpoints.DELETE_USERS)
            .set('authorization', token)
            .send({password: users[0].password, userIds: [users[1].id]})
            .expect(httpCodes.FORBIDDEN)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN)
            })
            .end(done)
    });

    it('admin should not delete itself', done => {
        request(app)
            .delete(endpoints.DELETE_USERS)
            .set('authorization', adminToken)
            .send({password: admin[0].password, userIds: [admin[0].id, users[0].id]})
            .expect(httpCodes.FORBIDDEN)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN)
            })
            .end(done);
    });

    it('moderator should not delete itself', done => {
        request(app)
            .delete(endpoints.DELETE_USERS)
            .set('authorization', moderatorToken)
            .send({password: moderator[0].password, userIds: [moderator[0].id]})
            .expect(httpCodes.FORBIDDEN)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN)
            })
            .end(done);
    })

    it('moderator should not delete admin', done => {
        request(app)
            .delete(endpoints.DELETE_USERS)
            .set('authorization', moderatorToken)
            .send({password: moderator[0].password, userIds: [admin[0].id]})
            .expect(httpCodes.FORBIDDEN)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN)
            })
            .end(done)
    });

    it('moderator should not delete another moderator', done => {
        request(app)
            .delete(endpoints.DELETE_USERS)
            .set('authorization', moderatorToken)
            .send({password: moderator[0].password, userIds: [moderator[1].id]})
            .expect(httpCodes.FORBIDDEN)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN)
            })
            .end(done)
    });

    it('admin should not delete another admin', done => {
        request(app)
            .delete(endpoints.DELETE_USERS)
            .set('authorization', adminToken)
            .send({password: admin[0].password, userIds: [admin[1].id]})
            .expect(httpCodes.FORBIDDEN)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN)
            })
            .end(done)
    });

    it('should not delete users without authorization token', done => {
        request(app)
            .delete(endpoints.DELETE_USERS)
            .send({password: users[0].password, userIds: [users[1].id]})
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN)
            })
            .end(done)
    });
    
    it('moderator should not delete with admin password', done => {
        request(app)
            .delete(endpoints.DELETE_USERS)
            .set('authorization', moderatorToken)
            .send({password: admin[0].password, userIds: [users[1].id]})
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe(errors.CREDENTIAL)
            })
            .end(done)
    });

})

describe('DELETE ' + endpoints.auth.LOG_OUT, () => {
    beforeEach(async ()=>{
        await wipeOutDatabase();
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
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res=>{
                expect(res.body.errors)
            })
            .end(done)
    });

    it('should not logout user due to absence of a token', done => {
        request(app)
            .delete(endpoints.auth.LOG_OUT)
            .expect(httpCodes.UNAUTHORIZED)
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