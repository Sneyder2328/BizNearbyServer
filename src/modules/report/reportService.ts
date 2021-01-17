import { errors } from '../../utils/constants/errors';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import { AppError } from '../../utils/errors/AppError';
import { Report } from '../../database/models/Report';
import { Business } from '../../database/models/Business';
import { User } from '../../database/models/User';
import { raw } from 'objection';
import { AuthError } from '../../utils/errors/AuthError';
import _ from 'lodash';
import { ReportReview } from '../../database/models/ReportReview';
/**
 * Verify if the user exist in the database
 * @param userId
 */
const verifyUser = async (userId: string) => {
    if (!await User.query().findById(userId)){
        throw new AppError(httpCodes.NOT_FOUND, errors.NOT_FOUND, errors.message.USER_NOT_FOUND);
    } 
};

/**
 * Verify if the business exist in the database
 * @param businessIdId
 */
const verifyBusiness = async (businessId: string) => {
    if (!await Business.query().findById(businessId)){
        throw new AppError(httpCodes.NOT_FOUND, errors.NOT_FOUND, errors.message.BUSINESS_NOT_FOUND);
    } 
};

export const newReport = async ({id, userId, businessId, title, description}) => {
    await verifyUser(userId);

    await verifyBusiness(businessId);

    const report = await Report.query().insert({id, userId, businessId, title, description});

    return report;
};

export const getReport = async (userId) => {
    const sessionUser = await User.query().findById(userId).where(raw('deletedAt IS NULL'));
    if(!sessionUser) throw new AuthError();
    if(sessionUser.typeUser == 'normal') throw new AuthError(errors.FORBIDDEN,errors.message.PERMISSION_NOT_GRANTED);
    const queryReports = await Report.query().leftJoin(raw('ReportReview ON ReportReview.reportId = id'));
    const reports = queryReports.map( report => {
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

export const reviewReport = async ({id, analysis}, sessionId) => {
    const sessionUser = await User.query().findById(sessionId).where(raw('deletedAt IS NULL'));
    if(!sessionUser) throw new AuthError(errors.NOT_FOUND,errors.message.USER_NOT_FOUND);
    if(sessionUser.typeUser == 'normal') throw new AuthError(errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED);
    const alreadyReviewed = await ReportReview.query().findOne('reportId', id);
    if(alreadyReviewed) throw new AuthError(errors.REPORT,errors.message.REPORT_REVIEWED);

    const report = await Report.query().findById(id).where(raw('deletedAt IS NULL'));
    if(!report) throw new AuthError(errors.NOT_FOUND,errors.message.REPORT_NOT_FOUND);
    const reportReviewed = await ReportReview.query().insert({userId: sessionId, reportId: id, analysis});
    return {...reportReviewed};
}