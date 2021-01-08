// @ts-ignore
import request from "supertest";
import {app, server} from "../../index";
import {wipeOutDatabase} from "../../test/setup";
import {endpoints} from "../../utils/constants/endpoints";
import {httpCodes} from "../../utils/constants/httpResponseCodes";
import {users} from "../../test/seed";
import {errors} from "../../utils/constants/errors";
import supertest = require("supertest");

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

    it('should not sign up due to an empty password', done => {
        request(app)
            .post(endpoints.users.SIGN_UP)
            .send({...users[3]})
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done)
    })

    for(let i=4;i<=6;i++){
        it('should sign up due to some input being too long', (done) => {
            request(app)
                .post(endpoints.users.SIGN_UP)
                .send({...users[i]})
                .expect(res => {
                    expect(res.body["errors"]);
                })
                .end(done);
        });
    }
});

afterAll((done) => {
    server.close(done);
});