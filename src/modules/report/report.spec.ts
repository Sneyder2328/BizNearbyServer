import request from 'supertest';
import { app, server } from '../../index';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import knex from "../../database/knex";
import { wipeOutDatabase, insertBusinessData, createReport, createUser, createSession, createReportReview, createReviewedReport, setupBusiness, wipeOutBusiness, wipeOutReports, setupFixedTable } from '../../test/setup';
import { admin, moderator, newReport, users } from '../../test/seed';
import { endpoints } from '../../utils/constants/endpoints';
import { errors } from '../../utils/constants/errors';
import { genUUID } from '../../utils/utils';

const normalToken = 'Bearer ' + genUUID();
const moderatorToken = "Bearer " + genUUID();
const adminToken = "Bearer " + genUUID();
const businessId = genUUID();
const businessAddressId = genUUID();

describe('POST' + endpoints.report.CREATE_REPORT, () => {
    beforeAll(async () => {
        await wipeOutDatabase();
        await setupFixedTable();
        await createUser({ ...users[0] });
        await createUser({ ...moderator[0] });
        await createUser({ ...admin[0] });
        await createSession({ token: normalToken.split(' ')[1], userId: users[0].id });
        await createSession({ token: adminToken.split(' ')[1], userId: admin[0].id });
        await createSession({ token: moderatorToken.split(' ')[1], userId: moderator[0].id });
        await setupBusiness(users[0].id, businessId, businessAddressId);
    })

    beforeEach(async () => {
        await wipeOutReports();
    });

    it('user should create a new report', (done) => {
        request(app)
            .post('/reports')
            .set('authorization', normalToken)
            .send({ ...newReport[0], businessId })
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body);
            })
            .end(done);
    });

    it('moderator should create a new report', (done) => {
        request(app)
            .post('/reports')
            .set('authorization', moderatorToken)
            .send({ ...newReport[0], businessId })
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body);
            })
            .end(done);
    });

    it('admin should create a new report', (done) => {
        request(app)
            .post('/reports')
            .set('authorization', adminToken)
            .send({ ...newReport[0], businessId })
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body);
            })
            .end(done);
    });

    it('should not create a new report without authorization', (done) => {
        request(app)
            .post('/reports')
            .set('authorization', genUUID())
            .send({ ...newReport[0], businessId })
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new report if businessId does not exist', (done) => {
        request(app)
            .post('/reports')
            .set('authorization', normalToken)
            .send({ ...newReport[1] })
            .expect(httpCodes.NOT_FOUND)
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new report without title', (done) => {
        request(app)
            .post('/reports')
            .set('authorization', normalToken)
            .send({ ...newReport[2], businessId })
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new report with a very long title', (done) => {
        request(app)
            .post('/reports')
            .set('authorization', normalToken)
            .send({ ...newReport[3], businessId })
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new report without description', (done) => {
        request(app)
            .post('/reports')
            .set('authorization', normalToken)
            .send({ ...newReport[4], businessId })
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new report with a very long description', (done) => {
        request(app)
            .post('/reports')
            .set('authorization', normalToken)
            .send({ ...newReport[5], businessId })
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });
});

describe('POST' + endpoints.report.REVIEW_REPORT, () => {
    beforeAll(async () => {
        await wipeOutDatabase();
        await setupFixedTable();
        await createUser({ ...moderator[0] });
        await createUser({ ...admin[0] });
        await createUser({ ...users[0] });
        await createSession({ token: moderatorToken.split(" ")[1], userId: moderator[0].id });
        await createSession({ token: adminToken.split(" ")[1], userId: admin[0].id });
        await createSession({ token: normalToken.split(" ")[1], userId: users[0].id });
        await setupBusiness(users[0].id, businessId, businessAddressId);
    })

    beforeEach(async () => {
        await wipeOutReports();
        await createReport({ ...newReport[0], userId: users[0].id, businessId });
    })

    const expectedRes = (userId: string, reportId: string, analysis: string) => {
        return { userId, reportId, analysis };
    }

    it('moderator should review report', done => {
        request(app)
            .post(endpoints.report.REVIEW_REPORT.replace(":reportId", newReport[0].id))
            .set('authorization', moderatorToken)
            .send({ analysis: "este man tiene razon, el negocio es una estafa" })
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toEqual(expectedRes(moderator[0].id, newReport[0].id, "este man tiene razon, el negocio es una estafa"));
            })
            .end(done)
    })

    it('admin should review report', done => {
        request(app)
            .post(endpoints.report.REVIEW_REPORT.replace(":reportId", newReport[0].id))
            .set('authorization', adminToken)
            .send({ analysis: "este man tiene razon, el negocio es una estafa" })
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toEqual(expectedRes(admin[0].id, newReport[0].id, "este man tiene razon, el negocio es una estafa"));
            })
            .end(done)
    })

    it('user should not review report', done => {
        request(app)
            .post(endpoints.report.REVIEW_REPORT.replace(":reportId", newReport[0].id))
            .set('authorization', normalToken)
            .send({ analysis: "este man tiene razon, el negocio es una estafa" })
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN)
            })
            .end(done)
    });

    it('moderator should not review report without analysis', done => {
        request(app)
            .post(endpoints.report.REVIEW_REPORT.replace(":reportId", newReport[0].id))
            .set('authorization', moderatorToken)
            .send({ analysis: null })
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body.errors.length).toBeGreaterThan(0);
            })
            .end(done)
    });

    it('should not review report without authorization', done => {
        request(app)
            .post(endpoints.report.REVIEW_REPORT.replace(":reportId", newReport[0].id))
            .send({ analysis: "este man tiene razon, el negocio es una estafa" })
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN)
            })
            .end(done)
    });
})

describe('GET ' + endpoints.report.GET_REPORTS, () => {
    beforeAll(async () => {
        await wipeOutDatabase();
        await setupFixedTable();
        await createUser({ ...moderator[0] });
        await createUser({ ...admin[0] });
        await createUser({ ...users[0] });
        await createSession({ token: moderatorToken.split(" ")[1], userId: moderator[0].id });
        await createSession({ token: adminToken.split(" ")[1], userId: admin[0].id });
        await createSession({ token: normalToken.split(" ")[1], userId: users[0].id });
        await insertBusinessData();
        await createReviewedReport({ ...newReport[0], userId: users[0].id });
        await createReport({ ...newReport[0], userId: users[0].id, title: "test 2", description: "testing 2", id: genUUID() });
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
    beforeAll(async () => {
        await wipeOutDatabase();
        await setupFixedTable();
        await createUser({ ...moderator[0] });
        await createUser({ ...admin[0] });
        await createUser({ ...users[0] });
        await createSession({ token: moderatorToken.split(" ")[1], userId: moderator[0].id });
        await createSession({ token: adminToken.split(" ")[1], userId: admin[0].id });
        await createSession({ token: normalToken.split(" ")[1], userId: users[0].id });
        await setupBusiness(users[0].id, businessId, businessAddressId);
    })

    beforeEach(async () => {
        await wipeOutReports();
        await createReviewedReport({ ...newReport[0], userId: users[0].id, businessId });
        await createReport({ businessId, userId: users[0].id, title: "test 2", description: "testing 2", id: reportId });
    })

    it('moderator should delete pending report', done => {
        request(app)
            .delete(endpoints.report.DELETE_REPORT.replace(':reportId', reportId))
            .set('authorization', moderatorToken)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.deleted).toBe(true);
            })
            .end(done)
    })

    it('admin should delete pending report', done => {
        request(app)
            .delete(endpoints.report.DELETE_REPORT.replace(':reportId', reportId))
            .set('authorization', adminToken)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.deleted).toBe(true);
            })
            .end(done)
    })

    it('moderator should delete reviewed report', done => {
        request(app)
            .delete(endpoints.report.DELETE_REPORT.replace(':reportId', newReport[0].id))
            .set('authorization', moderatorToken)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.deleted).toBe(true);
            })
            .end(done)
    })

    it('admin should delete reviewed report', done => {
        request(app)
            .delete(endpoints.report.DELETE_REPORT.replace(':reportId', newReport[0].id))
            .set('authorization', adminToken)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.deleted).toBe(true);
            })
            .end(done)
    })

    it('user should not delete pending report', done => {
        request(app)
            .delete(endpoints.report.DELETE_REPORT.replace(':reportId', reportId))
            .set('authorization', normalToken)
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN);
            })
            .end(done)
    })

    it('user should not delete reviewed report', done => {
        request(app)
            .delete(endpoints.report.DELETE_REPORT.replace(':reportId', newReport[0].id))
            .set('authorization', normalToken)
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN);
            })
            .end(done)
    })

    it('should not delete report without authorization', done => {
        request(app)
            .delete(endpoints.report.DELETE_REPORT.replace(':reportId', newReport[0].id))
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN);
            })
            .end(done)
    })

    it('should not delete report with wrong reportId', done => {
        request(app)
            .delete(endpoints.report.DELETE_REPORT.replace(':reportId', newReport[0].id + "123"))
            .set('authorization', moderatorToken)
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body.errors.length).toBeGreaterThan(0);
            })
            .end(done)
    })
})

afterAll(() => {
    knex.destroy();
    server.close();
});