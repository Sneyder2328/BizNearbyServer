import { errors } from '../../utils/constants/errors';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import { AppError } from '../../utils/errors/AppError';
import { Report } from '../../database/models/Report';
import { User } from '../../database/models/User';
import { raw } from 'objection';
import { AuthError } from '../../utils/errors/AuthError';
import _ from 'lodash';
import { ReportReview } from '../../database/models/ReportReview';
import { verifyUser } from '../user/userService';
import { verifyBusiness } from '../business/businessService';
import { findUserById } from '../user/authService';

const findReports = async (type: 'Pending' | 'Reviewed' | 'All') => {
    let queryReports;
    switch (type) {
        case 'Pending':
            queryReports = await Report.query().where(raw("reviewedAt IS NULL"))
                .andWhere(raw("deletedAt IS NULL"))
                .orderBy("updatedAt", "desc");
            break;
        case 'Reviewed':
            queryReports = await Report.query().where(raw("reviewedAt IS NOT NULL"))
                .andWhere(raw("deletedAt IS NULL"))
                .orderBy("updatedAt", "desc");
            break;
        case 'All':
            queryReports = await Report.query().where(raw("deletedAt IS NULL"))
                .orderBy("updatedAt", "desc");
    }
    return queryReports;
}

export const newReport = async ({ id, userId, businessId, title, description }) => {
    await verifyUser(userId);
    await verifyBusiness(businessId);

    const report = await Report.query().insert({ id, userId, businessId, title, description });
    return report;
};

export const getReport = async (userId: string, type: 'Pending' | 'Reviewed' | 'All') => {
    const sessionUser = await User.query().findById(userId).where(raw('deletedAt IS NULL'));
    if (!sessionUser) throw new AuthError();
    if (sessionUser.typeUser == 'normal') throw new AuthError(errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED);

    const queryReports = await findReports(type);
    const reports = queryReports.map(report => {
        return {
            id: report.id,
            userId: report.userId,
            businessId: report.businessId,
            title: report.title,
            description: report.description,
            createdAt: report['createdAt']
        }
    })
    return reports;
}

export const deleteReport = async (sessionId: string, reportId: string) => {
    const sessionUser = await findUserById(sessionId);
    if (sessionUser.typeUser == "normal") throw new AuthError(errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED);

    const reportDeleted = await Report.query().delete().where("id", reportId);
    if (reportDeleted == 0) throw new AuthError(errors.NOT_FOUND, errors.message.REPORT_NOT_FOUND);

    return reportDeleted != 0;
}

export const reviewReport = async ({ id, analysis }, userId) => {
    const sessionUser = await findUserById(userId);
    if (sessionUser.typeUser == 'normal') throw new AuthError(errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED);
    const alreadyReviewed = await ReportReview.query().findOne('reportId', id);
    if (alreadyReviewed) throw new AuthError(errors.REPORT, errors.message.REPORT_REVIEWED);

    const report = await Report.query().findById(id).where(raw('deletedAt IS NULL'));
    if (!report) throw new AuthError(errors.NOT_FOUND, errors.message.REPORT_NOT_FOUND);
    await ReportReview.query().insert({ userId, reportId: id, analysis });
    const reviewedAt = new Date();
    await Report.query().findById(id).update({ 'reviewedAt': reviewedAt });
    return {
        id: report.id,
        userId: userId,
        businessId: report.businessId,
        title: report.title,
        description: report.description,
        createdAt: report.createdAt,
        reviewedAt: reviewedAt,
    }
}