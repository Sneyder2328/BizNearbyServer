import request from 'supertest';
import { app, server} from '../../index';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import knex from "../../database/knex";
import { wipeOutDatabase, createUser, createSession, createBusiness, createUserBusiness} from '../../test/setup';
import { newReport } from '../../test/seed';

const token = 'Bearer fcd84d1f-ee1b-4636-9f61-78dc349f23e5';

describe('POST' + '/reports', () => {
    beforeEach(async () => {
        await wipeOutDatabase();
        await createUser({id: 'ebf9b67a-50a4-439b-9af6-25dd7ff4810f', fullname: 'Kevin Cheng', email: 'kevin@gmail.com', password: '12345678', typeLogin: 'email', typeUser: 'normal'});
        await createSession({token: 'fcd84d1f-ee1b-4636-9f61-78dc349f23e5', userId: 'ebf9b67a-50a4-439b-9af6-25dd7ff4810f'});
        await createBusiness({id: "a8bcd05e-4606-4a55-a5dd-002f8516493e", name: "Bodega Mi encanto", description: "My business it's so nice", bannerUrl: "AnURL"});
        //await createUserBusiness({userId: 'ebf9b67a-50a4-439b-9af6-25dd7ff4810f', businessId: "a8bcd05e-4606-4a55-a5dd-002f8516493e"});
    });

    it('should create a new report', (done) => {
        request(app)
            .post('/reports')
            .set('authorization', token)
            .send(newReport[0])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body);
            })
            .end(done);
    });

    it('should not create a new report without authorization', (done) => {
        request(app)
            .post('/reports')
            .set('authorization', 'a8bcd05e-4606-4a55-a5dd-002f8516493e')
            .send(newReport[0])
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new report if businessId does not exist', (done) => {
        request(app)
            .post('/reports')
            .set('authorization', token)
            .send(newReport[1])
            .expect(httpCodes.NOT_FOUND)
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new report without title', (done) => {
        request(app)
            .post('/reports')
            .set('authorization', token)
            .send(newReport[2])
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new report with a very long title', (done) => {
        request(app)
            .post('/reports')
            .set('authorization', token)
            .send(newReport[3])
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new report without description', (done) => {
        request(app)
            .post('/reports')
            .set('authorization', token)
            .send(newReport[4])
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new report with a very long description', (done) => {
        request(app)
            .post('/reports')
            .set('authorization', token)
            .send(newReport[5])
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });
});

afterAll(()=>{
    knex.destroy();
    server.close();
});