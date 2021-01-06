import config from "../../config/config";
import {body, param} from "express-validator";

const trimInside = () => str => str.replace(/\s\s/g, ' ');

export const paramUserIdValidationRules = [
    param('userId').trim().matches(config.regex.uuidV4)
];

export const signUpValidationRules = [
    body('id').trim().matches(config.regex.uuidV4).withMessage("Invalid Id"),
    body('fullname').customSanitizer(trimInside()).escape().isString()
        .isLength({min: 5}).withMessage('Full name must be at least 5 characters long'),
    body('email').isEmail().normalizeEmail().withMessage('You must enter a valid email address'),
    body('phoneNumber').trim().isString().escape().optional({nullable: true}),
    body('thumbnailUrl').trim().isString().escape().optional({nullable: true}),
    body('password').trim().isString().isLength({min: 8}).escape().withMessage('Password must be at least 8 characters long').optional({nullable: true}),
    body('apiKey').trim().isString().escape().optional({nullable: true}),
    body('typeLogin')
        .custom(val => val === 'email' || val === 'facebook' || val === 'google').withMessage('You must provide a valid type of login(email,facebook,google)'),
    body('typeUser')
        .custom(val=> val === 'moderator' || val === 'normal').withMessage("You must provide a valid type of user (moderator, normal)"),
];

export const logInValidationRules = [
    body('username').trim().escape(),
    body('password').escape()
];

/*
export const refreshTokenValidationRules = [
    header(config.headers.refreshToken).trim().matches(config.regex.uuidV4).withMessage('Refresh token provided is not an uuidV4 token')
];

export const getProfileValidationRules = [
    param('userIdentifier').trim().escape().custom((value: string) => {
        return value.match(config.regex.uuidV4) || value.match("^[a-zA-Z0-9]+$");
    }).withMessage("userIdentifier provided is not alphanumeric nor uuidV4")
];

export const updateProfileValidationRules = [
    param('userId').trim().escape().custom((value: string) => value.match(config.regex.uuidV4))
        .withMessage("userId provided is not uuidV4"),
    body('username').trim().escape()
        .isAlphanumeric().withMessage('Username can only contain alphanumeric characters(A-Z, 0-9)')
        .isLength({min: 5}).withMessage('Username must be at least 5 characters long'),
    body('fullname').customSanitizer(trimInside()).escape().isString()
        .isLength({min: 5}).withMessage('Full name must be at least 5 characters long'),
    body('description').trim().isString().escape(),
    body('coverPhotoUrl').trim().isString().escape(),
    body('profilePhotoUrl').trim().isString().escape()
]

export const searchUserValidationRules = [
    query('query').isString().exists()
];

const accessTokenIsValid = header(config.headers.accessToken).trim().matches(config.regex.jwt).withMessage('Access token provided is not a valid JWT');

export const getPhotoValidationRules = [
    param('photoId').trim().matches(config.regex.uuidV4)
];

export const createCommentValidationRules = [
    body('type').custom(val => val === 'text' || val === 'img'),
    param('postId').exists().escape(),
    body('id').exists().escape(),
    body('text').not().isEmpty(),
    body('img').escape()
];
*/