import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { signUpValidationRules, logInValidationRules } from './userRules';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { signUpUser, logInUser } from './userService';
import { endpoints } from '../../utils/constants/endpoints';
import config from '../../config/config';
import { verifyFBToken, verifyGoogleToken } from './authService';
import { AuthError } from '../../utils/errors/authErrors';
const router = Router();

router.post(endpoints.users.SIGN_UP, signUpValidationRules, validate, handleErrorAsync(async (req, res) => {
    const user = req.body;
    const isAuthenticated = (user.facebookAuth && await verifyFBToken(user.facebookAuth.userId, user.facebookAuth.token)) ||
                            (user.googleAuth && await verifyGoogleToken(user.googleAuth.userId, user.googleAuth.token, user.email) ||
                            user.typeLogin == "email");
    if (!isAuthenticated) throw new AuthError();
        
    const { profile, accessToken } = await signUpUser(user);
    res.header(config.headers.accessToken, accessToken)
        .json({ profile });
}));

router.post(endpoints.auth.LOG_IN, logInValidationRules, validate, handleErrorAsync(async (req, res) => {
    const loginRes = await logInUser(req.body);
    // @ts-ignore
    res.header(config.headers.accessToken, loginRes.uuid)
        .json({ profile: {...loginRes}});
}));

export {router as userRouter}
