import request from "supertest";
import { app, server } from '../../index';
import { wipeOutDatabase, createSession } from '../../test/setup';
import { endpoints } from '../../utils/constants/endpoints';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import { business, users } from '../../test/seed';
import { errors } from '../../utils/constants/errors';
import supertest = require('supertest');
import knex from "../../database/knex";
import { genUUID } from "../../utils/utils";


describe('POST' + '/businesses', () => {
    let session: string;
    beforeEach(async () => {
        await wipeOutDatabase();
        session=genUUID();
        await createSession(session);
    });

    it('should create new business', (done) => {
        request(app)
            .post('/businesses')
            .set("authorization","Bearer " + session)
            .send(business[0])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body);
            })
            .end(done);
    });

    it('should create a new business without cityCode, stateCode and countryCode', (done) => {
        request(app)
            .post('/businesses')
            .set("authorization","Bearer " + session)
            .send(business[1])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should create a new business without phone numbers', (done) => {
        request(app)
            .post('/businesses')
            .set("authorization","Bearer " + session)
            .send(business[2])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new business without latitude and longitude', (done) => {
        request(app)
            .post('/businesses')
            .set("authorization","Bearer " + session)
            .send(business[3])
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new business if the user not exists', (done) => {
        request(app)
            .post('/businesses')
            .set("authorization","Bearer " + session)
            .send(business[4])
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new business with a long name', (done) => {
        request(app)
            .post('/businesses')
                .set("authorization","Bearer " + session)
                .send(business[5])
                .expect(res => {
                    expect(res.body['errors']);
                })
                .end(done);
    });
    
});

afterAll(()=>{
    knex.destroy();
    server.close();
})