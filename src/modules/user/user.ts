import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { signUpValidationRules, logInValidationRules } from './userRules';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { signUpUser, logInUser, logoutUser } from './userService';
import { endpoints } from '../../utils/constants/endpoints';
import config from '../../config/config';
import { verifyFBToken, verifyGoogleToken } from './authService';
import { AuthError } from '../../utils/errors/AuthError';
import { AppError } from '../../utils/errors/AppError';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
const router = Router();

router.post(endpoints.users.SIGN_UP, signUpValidationRules, validate, handleErrorAsync(async (req, res) => {
    const user = req.body;
    const isAuthenticated = user.typeLogin == "email" ||
        (user?.facebookAuth && await verifyFBToken(user.facebookAuth?.userId, user.facebookAuth?.token)) ||
        (user?.googleAuth && await verifyGoogleToken(user.googleAuth?.userId, user.googleAuth?.token, user?.email));
    console.log('isAuthenticated=', isAuthenticated, user?.email);

    if (!isAuthenticated) throw new AuthError();

    const { profile, accessToken } = await signUpUser(user);
    res.header(config.headers.accessToken, accessToken)
        .json({ profile });
}));

router.post(endpoints.auth.LOG_IN, logInValidationRules, validate, handleErrorAsync(async (req, res) => {
    const loginRes = await logInUser(req.body);
    res.header(config.headers.accessToken, loginRes.accessToken)
        .json({ profile: { ...loginRes } });
}));

router.delete(endpoints.auth.LOG_OUT, handleErrorAsync(async (req, res) => {
    const accessToken = req.headers['authorization'].split(' ')[1];
    if(!accessToken) throw new AppError();
    res.send(await logoutUser(accessToken));
}));

export { router as userRouter }
