import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { signUpValidationRules } from './userRules';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { signUpUser } from './userService';
import { endpoints } from '../../utils/constants/endpoints';
import config from '../../config/config';
const router = Router();

router.post(endpoints.users.SIGN_UP, signUpValidationRules, validate, handleErrorAsync(async (req, res) => {
    const user = req.body;
    delete user?.apiKey;
    const { id, fullname, email, thumbnailUrl, uuid } = await signUpUser(user);
    res.header(config.headers.token, uuid)
        .json({ profile: { id, fullname, email, thumbnailUrl } });
}))

export { router as userRouter }