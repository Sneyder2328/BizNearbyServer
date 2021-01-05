import config from '../config/config';
import {AuthError} from '../utils/errors/authErrors';
import error from '../utils/constants/errors';

export default async (req, res, next) => {
    if (req.session && req.session.cookie && req.session.user) {
        next();
    } else {
        return next(new AuthError(error.AUTH_ERROR, error.message.SESSION_NOT_FOUND), req, res, next);
    }
};