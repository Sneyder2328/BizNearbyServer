import request from 'supertest';
import { app, server} from '../../index';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import knex from "../../database/knex";
import { wipeOutDatabase, insertBusinessData, createReport } from '../../test/setup';
import { admin, moderator, newReport, users } from '../../test/seed';
import { endpoints } from '../../utils/constants/endpoints';

const token = 'Bearer b337e27e-bcf0-4154-8a77-96daa873c9e5';
const moderatorToken = "Bearer fcd84d1f-ee5b-4636-9f61-78dc349f23e5";
const adminToken = "Bearer fcd84d1f-ee3b-4636-9f61-78dc349f23e5";

describe('POST' + '/reports', () => {
    beforeEach(async () => {
        await wipeOutDatabase();
        await insertBusinessData();
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

describe('GET' + endpoints.report.GET_REPORTS, () => {
    beforeAll(async ()=>{
        await wipeOutDatabase();
        await insertBusinessData();
        await createReport(newReport[0]);
        await createReport(newReport[1]);
        await createReport(newReport[2]);
    })

    it('should return reports', done => {
        
    })
})

afterAll(()=>{
    knex.destroy();
    server.close();
});