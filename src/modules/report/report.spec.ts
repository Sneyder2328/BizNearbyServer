import request from 'supertest';
import { app, server} from '../../index';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import knex from "../../database/knex";
import { wipeOutDatabase, insertBusinessData, createReport, createUser, createSession, createReportReview, createReviewedReport } from '../../test/setup';
import { admin, moderator, newReport, users } from '../../test/seed';
import { endpoints } from '../../utils/constants/endpoints';
import { errors } from '../../utils/constants/errors';
import { genUUID } from '../../utils/utils';
import { Report } from '../../database/models/Report';

const token = 'Bearer b337e27e-bcf0-4154-8a77-96daa873c9e5';
const normalToken = 'Bearer b339e27e-bcf0-4154-8a77-96daa873c9e5';
const moderatorToken = "Bearer fcd84d1f-ee5b-4636-9f61-78dc349f23e5";
const adminToken = "Bearer fcd84d1f-ee3b-4636-9f61-78dc349f23e5";

describe('POST' + endpoints.report.CREATE_REPORT, () => {
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

describe('POST' + endpoints.report.REVIEW_REPORT, () => {
    beforeEach(async ()=>{
        await wipeOutDatabase();
        await createUser({...moderator[0]});
        await createUser({...admin[0]});
        await createUser({...users[0]});
        await createSession({token: moderatorToken.split(" ")[1],userId: moderator[0].id});
        await createSession({token: adminToken.split(" ")[1],userId: admin[0].id});
        await createSession({token: normalToken.split(" ")[1],userId: users[0].id});
        await insertBusinessData();
        await createReport({...newReport[0], userId: users[0].id});
    })

    const expectedRes = (userId: string, reportId: string, analysis: string)=>{
        return {userId, reportId, analysis};
    }

    it('moderator should review report', done => {
        request(app)
            .post(endpoints.report.REVIEW_REPORT.replace(":reportId",newReport[0].id))
            .set('authorization',moderatorToken)
            .send({analysis:"este man tiene razon, el negocio es una estafa"})
            .expect(httpCodes.OK)
            .expect(res=>{
                expect(res.body).toEqual(expectedRes(moderator[0].id, newReport[0].id, "este man tiene razon, el negocio es una estafa"));
            })
            .end(done)
    })

    it('admin should review report', done => {
        request(app)
            .post(endpoints.report.REVIEW_REPORT.replace(":reportId",newReport[0].id))
            .set('authorization',adminToken)
            .send({analysis:"este man tiene razon, el negocio es una estafa"})
            .expect(httpCodes.OK)
            .expect(res=>{
                expect(res.body).toEqual(expectedRes(admin[0].id, newReport[0].id, "este man tiene razon, el negocio es una estafa"));
            })
            .end(done)
    })

    it('user should not review report', done => {
        request(app)
            .post(endpoints.report.REVIEW_REPORT.replace(":reportId",newReport[0].id))
            .set('authorization',normalToken)
            .send({analysis:"este man tiene razon, el negocio es una estafa"})
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res=>{
                expect(res.body.error).toBe(errors.FORBIDDEN)
            })
            .end(done)
    });

    it('moderator should not review report without analysis', done => {
        request(app)
            .post(endpoints.report.REVIEW_REPORT.replace(":reportId",newReport[0].id))
            .set('authorization',moderatorToken)
            .send({analysis:null})
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res=>{
                expect(res.body.errors.length).toBeGreaterThan(0);
            })
            .end(done)
    });

    it('should not review report without authorization', done => {
        request(app)
            .post(endpoints.report.REVIEW_REPORT.replace(":reportId",newReport[0].id))
            .send({analysis:"este man tiene razon, el negocio es una estafa"})
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res=>{
                expect(res.body.error).toBe(errors.FORBIDDEN)
            })
            .end(done)
    });
})

describe('GET ' + endpoints.report.GET_REPORTS, () => {
    beforeAll(async ()=>{
        await wipeOutDatabase();
        await createUser({...moderator[0]});
        await createUser({...admin[0]});
        await createUser({...users[0]});
        await createSession({token: moderatorToken.split(" ")[1],userId: moderator[0].id});
        await createSession({token: adminToken.split(" ")[1],userId: admin[0].id});
        await createSession({token: normalToken.split(" ")[1],userId: users[0].id});
        await insertBusinessData();
        await createReviewedReport({...newReport[0],userId: users[0].id});
        await createReport({...newReport[0],userId: users[0].id, title: "test 2", description: "testing 2", id: genUUID()});
    })

    const report = {
        businessId: expect.any(String),
        id: expect.any(String),
        userId: expect.any(String),
        description: expect.any(String),
        title: expect.any(String),
        createdAt: expect.any(String)
    }

    it('moderator should get pending reports', done => {
        request(app)
            .get(endpoints.report.GET_REPORTS + '?type=Pending')
            .set('authorization', moderatorToken)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.length).toBe(1);
                expect(res.body[0]).toEqual(report)
            })
            .end(done)
    });

    it('moderator should get reviewed reports', done => {
        request(app)
            .get(endpoints.report.GET_REPORTS + '?type=Reviewed')
            .set('authorization', moderatorToken)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.length).toBe(1);
                expect(res.body[0]).toEqual(report)
            })
            .end(done)
    });

    it('moderator should get all reports', done => {
        request(app)
            .get(endpoints.report.GET_REPORTS + '?type=All')
            .set('authorization', moderatorToken)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.length).toBe(2);
                expect(res.body[0]).toEqual(report)
            })
            .end(done)
    });

    it('admin should get pending reports', done => {
        request(app)
            .get(endpoints.report.GET_REPORTS + '?type=Pending')
            .set('authorization', moderatorToken)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.length).toBe(1);
                expect(res.body[0]).toEqual(report)
            })
            .end(done)
    });

    it('admin should get reviewed reports', done => {
        request(app)
            .get(endpoints.report.GET_REPORTS + '?type=Reviewed')
            .set('authorization', adminToken)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.length).toBe(1);
                expect(res.body[0]).toEqual(report)
            })
            .end(done)
    });

    it('admin should get all reports', done => {
        request(app)
            .get(endpoints.report.GET_REPORTS + '?type=All')
            .set('authorization', adminToken)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.length).toBe(2);
                expect(res.body[0]).toEqual(report)
            })
            .end(done)
    });

    it('user should not get reports', done => {
        request(app)
            .get(endpoints.report.GET_REPORTS + '?type=Pending')
            .set('authorization', normalToken)
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toEqual(errors.FORBIDDEN)
            })
            .end(done)
    });

    it('should not get reports without authorization', done => {
        request(app)
            .get(endpoints.report.GET_REPORTS + '?type=Pending')
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toEqual(errors.FORBIDDEN)
            })
            .end(done)
    });
})

describe('DELETE ' + endpoints.report.DELETE_REPORT, () => {
    const reportId = genUUID();
    beforeEach(async ()=>{
        await wipeOutDatabase();
        await createUser({...moderator[0]});
        await createUser({...admin[0]});
        await createUser({...users[0]});
        await createSession({token: moderatorToken.split(" ")[1],userId: moderator[0].id});
        await createSession({token: adminToken.split(" ")[1],userId: admin[0].id});
        await createSession({token: normalToken.split(" ")[1],userId: users[0].id});
        await insertBusinessData();
        await createReviewedReport({...newReport[0],userId: users[0].id});
        await createReport({...newReport[0],userId: users[0].id, title: "test 2", description: "testing 2", id: reportId});
    })

    it('moderator should delete report not reviewed', done => {
        request(app)
            .delete(endpoints.report.DELETE_REPORT.replace(':reportId',reportId))
            .set('authorization', moderatorToken)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.deleted).toBe(true);
            })
            .end(done)
    })

    it('admin should delete report not reviewed', done => {
        request(app)
            .delete(endpoints.report.DELETE_REPORT.replace(':reportId',reportId))
            .set('authorization', adminToken)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.deleted).toBe(true);
            })
            .end(done)
    })

    it('moderator should delete reviewed report', done => {
        request(app)
            .delete(endpoints.report.DELETE_REPORT.replace(':reportId',newReport[0].id))
            .set('authorization', moderatorToken)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.deleted).toBe(true);
            })
            .end(done)
    })

    it('admin should delete reviewed report', done => {
        request(app)
            .delete(endpoints.report.DELETE_REPORT.replace(':reportId',newReport[0].id))
            .set('authorization', adminToken)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.deleted).toBe(true);
            })
            .end(done)
    })
})

afterAll(()=>{
    knex.destroy();
    server.close();
});