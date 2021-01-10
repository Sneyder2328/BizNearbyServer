import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { signUpValidationRules, logInValidationRules } from './userRules';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { signUpUser, logInUser } from './userService';
import { endpoints } from '../../utils/constants/endpoints';
import config from '../../config/config';
import { verifyFBToken, verifyGoogleToken } from '../../middlewares/verifyAuthToken';
import { AppError } from '../../utils/errors/appError';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
const router = Router();

router.post(endpoints.users.SIGN_UP, signUpValidationRules, validate, handleErrorAsync(async (req, res) => {
    const user = req.body;
    console.log(user.facebookAuth);
    const isAuthenticated = (user.facebookAuth && await verifyFBToken(user.facebookAuth.token, user.facebookAuth.userId)) ||
                            (user.googleAuth && await verifyGoogleToken(user.googleAuth.token, user.googleAuth.userId));
    if (!isAuthenticated) throw new AppError(httpCodes.UNAUTHORIZED, "Authorization", "Authorization failed");
    console.log(isAuthenticated);
    delete user?.googleAuth;
    delete user?.facebookAuth;
    
    const { id, fullname, email, thumbnailUrl, uuid } = await signUpUser(user);
    res.header(config.headers.token, uuid)
        .json({ profile: { id, fullname, email, thumbnailUrl } });
}));

router.post(endpoints.auth.LOG_IN, logInValidationRules, validate, handleErrorAsync(async (req, res) => {
    const loginRes = await logInUser(req.body);
    res.header(config.headers.token, loginRes.uuid)
        .json({ profile: {...loginRes}});
}));

export {router as userRouter}
