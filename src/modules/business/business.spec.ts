import request from "supertest";
import { app, server } from '../../index';
import { wipeOutDatabase } from '../../test/setup';
import { endpoints } from '../../utils/constants/endpoints';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import { business } from '../../test/seed';
import { errors } from '../../utils/constants/errors';
import supertest = require('supertest');
import knex from "../../database/knex";

describe('POST' + '/businesses', () => {
    beforeEach(async () => {
        await wipeOutDatabase();
    });

    it('should create new business', (done) => {
        request(app)
            .post('/businesses')
            .send(business[0])
            .setHeader('authorization', 'fcd84d1f-ee1b-4636-9f61-78dc349f23e5')
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body);
            })
            .end(done);
    });

    it('should create a new business without cityCode, stateCode and countryCode', (done) => {
        request(app)
            .post('/businesses')
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
            .send(business[3])
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new business if the user not exists', (done) => {
        request(app)
            .post('/businesses')
            .send(business[4])
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new business with a long name', (done) => {
        request(app)
            .post('/businesses')
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