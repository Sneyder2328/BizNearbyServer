import config from '../config/config';
import { findSession, isSessionExpired } from '../modules/user/authService';
import { errors } from '../utils/constants/errors';
import { AuthError } from '../utils/errors/AuthError';

export const authenticate = async (req, res, next) => {
    const accessToken = req.header(config.headers.accessToken).split(" ")[1];
    if (!config.regex.authorization.test(accessToken)) {
        return next(new AuthError('accessToken', errors.message.ACCESS_TOKEN_INVALID), req, res, next);
    }
    const session = await findSession(accessToken)
    if (!session) {
        return next(new AuthError(), req, res, next);
    }
    if (isSessionExpired(session)) {
        return next(new AuthError('accessToken', errors.message.ACCESS_TOKEN_EXPIRED), req, res, next);
    }
    req.userId = session.userId
    next();
};