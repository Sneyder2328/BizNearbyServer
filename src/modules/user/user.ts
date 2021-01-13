import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { signUpValidationRules, logInValidationRules, logOutValidationRules, editValidationRules } from './userRules';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { signUpUser, logInUser, logoutUser, editUser } from './userService';
import { endpoints } from '../../utils/constants/endpoints';
import config from '../../config/config';
import { verifyFBToken, verifyGoogleToken } from './authService';
import { AuthError } from '../../utils/errors/AuthError';
import { authenticate } from '../../middlewares/authenticate';
import { cloudinary } from "../../config/cloudinaryConfig";
import cloudinaryStorage from "multer-storage-cloudinary";
import multer from "multer";
import { MAX_IMG_FILE_SIZE } from '../../utils/constants';

const storage = cloudinaryStorage({
    cloudinary,
    params: {
        folder: 'usersImages',
        format: async (req, file) => { 
            return "jpg,png,jpeg"
            // return ['jpg', 'png', "jpeg"]
        },
        // filename: function (req, file, cb) {
        //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        //     cb(null, file.fieldname + '-' + uniqueSuffix)
        // },
        public_id: (req, file) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            return file.fieldname + '-' + uniqueSuffix
        },
        transformation: [{ width: 960, height: 960, crop: 'limit' }]
    }
});
const parser = multer({
    storage,
    limits: { fileSize: MAX_IMG_FILE_SIZE }
});
const imageUpload = parser.single('imageProfile');

const router = Router();

router.post(endpoints.users.SIGN_UP, imageUpload, signUpValidationRules, validate, handleErrorAsync(async (req, res) => {
    const user = req.body;
    const isAuthenticated = user.typeLogin == "email" ||
        (user?.facebookAuth && await verifyFBToken(user.facebookAuth?.userId, user.facebookAuth?.token)) ||
        (user?.googleAuth && await verifyGoogleToken(user.googleAuth?.userId, user.googleAuth?.token, user?.email));

    if (!isAuthenticated) throw new AuthError();

    const { profile, accessToken } = await signUpUser(user);
    res.header(config.headers.accessToken, accessToken)
        .json({ profile });
}));

router.post(endpoints.auth.LOG_IN, logInValidationRules, validate, handleErrorAsync(async (req, res) => {
    const { accessToken, profile } = await logInUser(req.body);
    res.header(config.headers.accessToken, accessToken)
        .json({ profile });
}));

router.put(endpoints.users.UPDATE_PROFILE, authenticate, editValidationRules, validate, handleErrorAsync(async (req, res) => {
    const user = req.body;
    user.id = req.params?.userId;
    const { profile } = await editUser(user);
    res.json({ profile })
}))

router.delete(endpoints.auth.LOG_OUT, logOutValidationRules, validate, handleErrorAsync(async (req, res) => {
    const accessToken = req.headers[config.headers.accessToken].split(' ')[1];
    if (!accessToken) throw new AuthError();
    const logOut = await logoutUser(accessToken);
    res.send({ logOut });
}));

export { router as userRouter }
