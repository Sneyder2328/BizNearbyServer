import {AuthError} from '../utils/errors/authErrors';
import {errors} from '../utils/constants/errors';

export default async (req, res, next) => {
    if (req.session && req.session.cookie && req.session.user) {
        next();
    } else {
        return next(new AuthError(errors.AUTH_ERROR, errors.message.SESSION_NOT_FOUND), req, res, next);
    }
};