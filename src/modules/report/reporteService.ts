import { errors } from '../../utils/constants/errors';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import { AppError } from '../../utils/errors/AppError';
import { Report } from '../../database/models/Report';
import { Business } from '../../database/models/Business';
import { User } from '../../database/models/User';

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