import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { signUpValidationRules, logInValidationRules } from './userRules';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { signUpUser, logInUser } from './userService';
import { endpoints } from '../../utils/constants/endpoints';
import config from '../../config/config';
const router = Router();

router.post(endpoints.users.SIGN_UP, signUpValidationRules, validate, handleErrorAsync(async (req, res) => {
    const user = req.body;
    delete user?.apiKey;
    const { id, fullname, email, thumbnailUrl, uuid } = await signUpUser(user);
    res.header(config.headers.token, uuid)
        .json({ profile: { id, fullname, email, thumbnailUrl } });
}));

router.post(endpoints.auth.LOG_IN, logInValidationRules, validate, handleErrorAsync(async (req, res) => {
    const {email, password} = req.body;
    const loginRes = await logInUser(email, password);
    res.header(config.headers.token, loginRes.uuid)
        .json({ profile: {...loginRes}});
}));

export {router as userRouter}
