import request from "supertest";
import { app, server } from '../../index';
import { wipeOutDatabase } from '../../test/setup';
import { endpoints } from '../../utils/constants/endpoints';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import { business } from '../../test/seed';
import { errors } from '../../utils/constants/errors';
import supertest = require('supertest');

describe('POST' + '/businesses', () => {
    beforeEach(async () => {
        await wipeOutDatabase();
    });

    for(let i = 0; i <= 2; i++){
        it('should create new business', (done) => {
            request(app)
                .post('/businesses')
                .send(business[i])
                .expect(httpCodes.OK)
                .expect(res => {
                    expect(res.body);
                })
                .end(done);
        });
    }

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

afterAll((done) => {
    server.close(done);
});