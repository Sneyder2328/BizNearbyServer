import request from "supertest";
import { app, server } from '../../index';
import { wipeOutDatabase } from '../../test/setup';
import { endpoints } from '../../utils/constants/endpoints';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import { business, updateBusiness } from '../../test/seed';
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
            .set('authorization', 'fcd84d1f-ee1b-4636-9f61-78dc349f23e5')
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
            .set('authorization', 'fcd84d1f-ee1b-4636-9f61-78dc349f23e5')
            .send(business[1])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body);
            })
            .end(done);
    });

    it('should create a new business without phone numbers', (done) => {
        request(app)
            .post('/businesses')
            .set('authorization', 'fcd84d1f-ee1b-4636-9f61-78dc349f23e5')
            .send(business[2])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body);
            })
            .end(done);
    });

    it('should not create a new business without latitude and longitude', (done) => {
        request(app)
            .post('/businesses')
            .set('authorization', 'fcd84d1f-ee1b-4636-9f61-78dc349f23e5')
            .send(business[3])
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new business if the user not exists', (done) => {
        request(app)
            .post('/businesses')
            .set('authorization', 'ebf9b67a-50a4-439b-9af6-25dd7ff4810f')
            .send(business[4])
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new business with a long name', (done) => {
        request(app)
            .post('/businesses')
            .set('authorization', 'fcd84d1f-ee1b-4636-9f61-78dc349f23e5')
            .send(business[5])
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    // UPDATE BUSINESS TESTS

    it('should update business name', (done) => {
        request(app)
            .put('/businesses/a8bcd05e-4606-4a55-a5dd-002f8516493e')
            .set('authorization', 'fcd84d1f-ee1b-4636-9f61-78dc349f23e5')
            .send(updateBusiness[0])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body)
            })
            .end(done);
    });

    it('should update business description', (done) => {
        request(app)
            .put('/businesses/a8bcd05e-4606-4a55-a5dd-002f8516493e')
            .set('authorization', 'fcd84d1f-ee1b-4636-9f61-78dc349f23e5')
            .send(updateBusiness[1])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body)
            })
            .end(done);
    });

    it('should update business address', (done) => {
        request(app)
            .put('/businesses/a8bcd05e-4606-4a55-a5dd-002f8516493e')
            .set('authorization', 'fcd84d1f-ee1b-4636-9f61-78dc349f23e5')
            .send(updateBusiness[2])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body)
            })
            .end(done);
    });

    it('should update business latitude and longitude', (done) => {
        request(app)
            .put('/businesses/a8bcd05e-4606-4a55-a5dd-002f8516493e')
            .set('authorization', 'fcd84d1f-ee1b-4636-9f61-78dc349f23e5')
            .send(updateBusiness[3])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body)
            })
            .end(done);
    });

    it('should update business cityCode, stateCode and countryCode', (done) => {
        request(app)
            .put('/businesses/a8bcd05e-4606-4a55-a5dd-002f8516493e')
            .set('authorization', 'fcd84d1f-ee1b-4636-9f61-78dc349f23e5')
            .send(updateBusiness[4])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body)
            })
            .end(done);
    });

    it('should update business bannerUrl', (done) => {
        request(app)
            .put('/businesses/a8bcd05e-4606-4a55-a5dd-002f8516493e')
            .set('authorization', 'fcd84d1f-ee1b-4636-9f61-78dc349f23e5')
            .send(updateBusiness[5])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body)
            })
            .end(done);
    });

    it('should update business hours', (done) => {
        request(app)
            .put('/businesses/a8bcd05e-4606-4a55-a5dd-002f8516493e')
            .set('authorization', 'fcd84d1f-ee1b-4636-9f61-78dc349f23e5')
            .send(updateBusiness[6])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body)
            })
            .end(done);
    });

    it('should update business phone number', (done) => {
        request(app)
            .put('/businesses/a8bcd05e-4606-4a55-a5dd-002f8516493e')
            .set('authorization', 'fcd84d1f-ee1b-4636-9f61-78dc349f23e5')
            .send(updateBusiness[7])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body)
            })
            .end(done);
    });

    it('should update business category', (done) => {
        request(app)
            .put('/businesses/a8bcd05e-4606-4a55-a5dd-002f8516493e')
            .set('authorization', 'fcd84d1f-ee1b-4636-9f61-78dc349f23e5')
            .send(updateBusiness[8])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body)
            })
            .end(done);
    });

    it('should add new user to userBusiness', (done) => {
        request(app)
            .put('/businesses/a8bcd05e-4606-4a55-a5dd-002f8516493e')
            .set('authorization', 'fcd84d1f-ee1b-4636-9f61-78dc349f23e5')
            .send(updateBusiness[9])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body)
            })
            .end(done);
    });

    it('should not update with a wrong businessId', (done) => {
        request(app)
            .put('/businesses/8d4b7b25-e249-4550-af02-c43be3054d4f')
            .set('authorization', 'fcd84d1f-ee1b-4636-9f61-78dc349f23e5')
            .send(updateBusiness[0])
            .expect(httpCodes.NOT_FOUND)
            .expect(res => {
                expect(res.body)
            })
            .end(done);
    });

    it('should update without authorization', (done) => {
        request(app)
            .put('/businesses/a8bcd05e-4606-4a55-a5dd-002f8516493e')
            .set('authorization', 'f94bcebf-f181-447b-b85f-3c5f36c2a269')
            .send(updateBusiness[0])
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body)
            })
            .end(done);
    });
    
    it('should not update with a wrong addressId', (done) => {
        request(app)
            .put('/businesses/a8bcd05e-4606-4a55-a5dd-002f8516493e')
            .set('authorization', 'fcd84d1f-ee1b-4636-9f61-78dc349f23e5')
            .send(updateBusiness[10])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body)
            })
            .end(done);
    });
});

afterAll(()=>{
    knex.destroy();
    server.close();
})