
import { findUserById } from '../modules/user/authService';
import { errors } from '../utils/constants/errors';
import { httpCodes } from '../utils/constants/httpResponseCodes';
import { AppError } from '../utils/errors/AppError';

export const ADMIN = 'admin'
export const MODERATOR = 'moderator'

export const verifyUserType = (...type: Array<'admin' | 'moderator'>) => async (req, res, next) => {
    const user = await findUserById(req.userId);
    //@ts-ignore
    if (!type.includes(user?.typeUser)) {
        return next(new AppError(httpCodes.FORBIDDEN, errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED), req, res, next);
    }
    next();
};