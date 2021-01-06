// @ts-ignore
import request from "supertest";
import {app, server} from "../../index";
import {CreateUser, wipeOutDatabase} from "../../test/setup";
import {endpoints} from "../../utils/constants/endpoints";
import {httpCodes} from "../../utils/constants/httpResponseCodes";
import {users} from "../../test/seed";
import {errors} from "../../utils/constants/errors";
import supertest = require("supertest");

describe('POST' + endpoints.users.SIGN_UP, () => {
    beforeEach(async () => {
        await wipeOutDatabase();
    });

    it('should sign up a new user', (done) => {
        request(app)
            .post(endpoints.users.SIGN_UP)
            .send({...users[0]})
            .expect(httpCodes.OK)
            .expect((res) => {
                expect(res.body['access']).toBe(true);
            })
            .end(done);
    });
});

afterAll((done) => {
    server.close(done);
});