// @ts-ignore
import request from "supertest";
import {app, server} from "../../index";
import {wipeOutDatabase, CreateUser} from "../../test/setup";
import {endpoints} from "../../utils/constants/endpoints";
import {httpCodes} from "../../utils/constants/httpResponseCodes";
import {users} from "../../test/seed";
import {errors} from "../../utils/constants/errors";

describe('POST ' + endpoints.users.SIGN_UP, () => {
    beforeEach(async () => {
        await wipeOutDatabase();
    });

    for(let i=0;i<=2;i++){
        it('should sign up a new user', (done) => {
            request(app)
                .post(endpoints.users.SIGN_UP)
                .send({...users[i]})
                .expect(httpCodes.OK)
                .expect(res => {
                    expect(res.body["profile"]);
                })
                .end(done);
        });
    }

    it('should sign up a new user', done => {
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

    for(let i=4;i<=6;i++){
        it('should not sign up due to some input being too long', (done) => {
            request(app)
                .post(endpoints.users.SIGN_UP)
                .send({...users[i]})
                .expect(httpCodes.UNPROCESSABLE_ENTITY)
                .expect(res => {
                    expect(res.body["errors"]);
                })
                .end(done);
        });
    }

});

describe('POST ' + endpoints.auth.LOG_IN, () => {
    beforeAll(async ()=>{
        await wipeOutDatabase();
        await Promise.all(users.slice(0,3).map(user => CreateUser(user)));
    });

    for(let i=0;i<3;i++){
        it("should Log in", done=>{
            request(app)
                .post(endpoints.auth.LOG_IN)
                .send({email: users[i].email, password: users[i].password, typeLogin: users[i].typeLogin})
                .expect(httpCodes.OK)
                .expect(res=>{
                    expect(res.body['profile']);
                })
                .end(done);
        });
    }

    for(let i =0;i<=7;i+=7){
        it('should not login due to wrong credentials', done=>{
            request(app)
                .post(endpoints.auth.LOG_IN)
                .send({email: users[0], password: '123', typeLogin: 'email'})
                .expect(httpCodes.UNAUTHORIZED)
                .expect(res=>{
                    expect(res.body?.error).toBe(errors.CREDENTIAL);
                    expect(res.body?.message).toBe(errors.message.INCORRECT_CREDENTIALS);
                })
                .end(done);
        });
    }

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

afterAll((done) => {
    server.close(done);
});