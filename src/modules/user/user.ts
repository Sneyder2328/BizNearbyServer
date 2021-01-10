import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { signUpValidationRules, logInValidationRules } from './userRules';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { signUpUser, logInUser } from './userService';
import { endpoints } from '../../utils/constants/endpoints';
import { AuthError } from '../../utils/errors/authErrors';
import config from '../../config/config';
import { verifyFBToken, verifyGoogleToken } from './authService';
const router = Router();

router.post(endpoints.users.SIGN_UP, signUpValidationRules, validate, handleErrorAsync(async (req, res) => {
    const user = req.body;
    const isAuthenticated = (user.facebookAuth && verifyFBToken(user.facebookAuth.idToken, user.facebookAuth.userId)) ||
                            (user.googleAuth && verifyGoogleToken(user.googleAuth.idToken, user.googleAuth.userId));
    if (!isAuthenticated) throw new AuthError();
    
    delete user?.googleAuth;
    delete user?.facebookAuth;
    
    const { id, fullname, email, thumbnailUrl, uuid } = await signUpUser(user);
    res.header(config.headers.accessToken, uuid)
        .json({ profile: { id, fullname, email, thumbnailUrl } });
}));

router.post(endpoints.auth.LOG_IN, logInValidationRules, validate, handleErrorAsync(async (req, res) => {
    const loginRes = await logInUser(req.body);
    res.header(config.headers.accessToken, loginRes.uuid)
        .json({ profile: {...loginRes}});
}));

export {router as userRouter}
