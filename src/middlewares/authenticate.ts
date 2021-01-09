import {AuthError} from '../utils/errors/authErrors';

export const authenticate = async (req, res, next) => {
    if (req.session?.cookie && req.session?.user) {
        next();
    } else {
        return next(new AuthError(), req, res, next);
    }
};