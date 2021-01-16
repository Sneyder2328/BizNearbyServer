import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { signUpValidationRules, logInValidationRules, editValidationRules, deleteValidationRules } from './userRules';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { signUpUser, logInUser, logoutUser, editUser, deleteUser, getProfile, deleteMultipleUsers } from './userService';
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
        format: () => ("jpeg"),
        public_id: () => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            return uniqueSuffix
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

/**
 * Sign up new user
 */
router.post(endpoints.users.SIGN_UP, imageUpload, signUpValidationRules, validate, handleErrorAsync(async (req, res) => {
    const user = req.body;

    // if there's an image(file) uploaded, then take url(path)
    if (req.file?.path) {
        user.thumbnailUrl = req.file?.path
    }

    const isAuthenticated = user.typeLogin == "email" ||
        (user?.facebookAuth && await verifyFBToken(user.facebookAuth?.userId, user.facebookAuth?.token)) ||
        (user?.googleAuth && await verifyGoogleToken(user.googleAuth?.userId, user.googleAuth?.token, user?.email));

    if (!isAuthenticated) throw new AuthError();

    const { profile, accessToken } = await signUpUser(user);
    res.header(config.headers.accessToken, accessToken)
        .json({ ...profile });
}));


/**
 * Log in
 */
router.post(endpoints.auth.LOG_IN, logInValidationRules, validate, handleErrorAsync(async (req, res) => {
    const { accessToken, profile } = await logInUser(req.body);
    res.header(config.headers.accessToken, accessToken)
        .json({ ...profile });
}));


/**
 * Update user profile
 */
router.put(endpoints.users.UPDATE_PROFILE, editValidationRules, validate, authenticate, imageUpload, handleErrorAsync(async (req, res) => {
    const user = req.body;
    if (req.userId != req.params.userId) throw new AuthError();
    // if there's an image(file) uploaded, then take url(path)
    if (req.file?.path) {
        user.thumbnailUrl = req.file?.path
    }
    user.id = req.params.userId;

    const { profile } = await editUser(user);
    res.json({ ...profile });
}))

/**
 * Get user profile
 */
router.get(endpoints.users.GET_PROFILE, authenticate, handleErrorAsync(async (req, res) => {
    const userId = req.params.userId;
    if(userId != req.userId) throw new AuthError();
    const {profile} = await getProfile(userId);
    res.json({...profile});
}))

/**
 * Log out
 */
router.delete(endpoints.auth.LOG_OUT, authenticate, handleErrorAsync(async (req, res) => {
    const accessToken = req.headers[config.headers.accessToken].split(' ')[1];
    const logOut = await logoutUser(accessToken);
    res.send({ logOut });
}));


/**
 * Delete user
 */
router.delete(endpoints.users.DELETE_ACCOUNT, authenticate, deleteValidationRules, validate, handleErrorAsync(async (req, res) => {
    const user = {password: req.body?.password, id: req.params.userId};
    const deleted = await deleteUser(user, req.userId);
    res.json({deleted});
}))

/**
 * Delete multiple users
 */
//  ----------UNDER CONSTRUCTION DON'T TOUCH--------------
router.delete(endpoints.DELETE_USERS, authenticate, deleteValidationRules, validate, handleErrorAsync(async (req, res) => {
    const user = {password: req.body?.password, ids: req.body.userIds};
    const usersDeleted = await deleteMultipleUsers(user, req.userId);
    res.json({usersDeleted});
}))

export { router as userRouter }
