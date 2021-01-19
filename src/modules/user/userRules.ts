import config from "../../config/config";
import { body, header, param } from "express-validator";

const trimInside = () => (str?: String) => str?.replace(/\s\s/g, ' ');

export const paramUserIdValidationRules = [
    param('userId').trim().matches(config.regex.uuidV4)
];

export const signUpValidationRules = [
    body('id').trim().matches(config.regex.uuidV4).withMessage("Invalid Id"),
    body('fullname').customSanitizer(trimInside()).escape().isString()
        .isLength({ min: 4 }).withMessage('Full name must be at least 4 characters long')
        .isLength({ max: 70 }).withMessage("Full Name too long"),
    body('email').isEmail().normalizeEmail().withMessage('You must enter a valid email address')
        .isLength({ max: 250 }).withMessage('email too long'),
    body('phoneNumber').trim().isString().escape()
        .optional({ nullable: true })
        .isLength({ max: 50 }).withMessage('phoneNumber too long'),
    body('thumbnailUrl').trim().isString().escape()
        .optional({ nullable: true })
        .isLength({ max: 500 }).withMessage('thumbnailUrl too long'),
    body('password').trim().isString().escape()
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .isLength({ max: 255 }).withMessage('Password too long')
        .optional({ nullable: true }),
    body('googleAuth.token').trim().isString()
        .optional({ nullable: true }),
    body('googleAuth.userId').trim().matches(/^\d*$/)
        .optional({ nullable: true }).withMessage("Invalid Id"),
    body('facebookAuth.token').trim().isString()
        .optional({ nullable: true }),
    body('facebookAuth.userId').trim().matches(/^\d*$/)
        .optional({ nullable: true }).withMessage("Invalid Id"),
    body('typeLogin')
        .custom(val => val === 'email' || val === 'facebook' || val === 'google').withMessage('You must provide a valid type of login(email,facebook,google)'),
];

export const logInValidationRules = [
    body('email').trim().escape(),
    body('password').escape()
        .optional({ nullable: true }),
    body('typeLogin')
        .custom(val => val === 'email' || val === 'facebook' || val === 'google').withMessage('You must provide a valid type of login(email,facebook,google)'),
    body('googleAuth.token').trim().isString()
        .optional({ nullable: true }),
    body('googleAuth.userId').trim().matches(/^\d*$/)
        .optional({ nullable: true }).withMessage("Invalid Id"),
    body('facebookAuth.token').trim().isString()
        .optional({ nullable: true }),
    body('facebookAuth.userId').trim().matches(/^\d*$/)
        .optional({ nullable: true }).withMessage("Invalid Id"),

];

export const editValidationRules = [
    param('userId').exists().matches(config.regex.uuidV4),
    body('fullname').customSanitizer(trimInside()).escape().isString()
        .isLength({ min: 4 }).withMessage('Full name must be at least 4 characters long')
        .isLength({ max: 70 }).withMessage("Full Name too long"),
    body('email').isEmail().normalizeEmail().withMessage('You must enter a valid email address')
        .isLength({ max: 250 }).withMessage('email too long'),
    body('phoneNumber').trim().isString().escape()
        .optional({ nullable: true })
        .isLength({ max: 50 }).withMessage('phoneNumber too long'),
    body('thumbnailUrl').trim().isString().escape()
        .optional({ nullable: true })
        .isLength({ max: 500 }).withMessage('thumbnailUrl too long'),
    body('password').trim().isString().escape()
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .isLength({ max: 255 }).withMessage('Password too long')
        .optional({ nullable: true })
];

export const deleteValidationRules = [
    header(config.headers.accessToken).matches(config.regex.authorization),
    body('password').escape().optional({nullable: true})
]

export const getProfileValidationRules = [
    param('userId').exists().matches(config.regex.uuidV4)
]

export const deleteUserValidationRules = [
    ...deleteValidationRules,
    param('userId').exists().matches(config.regex.uuidV4)
]

export const deleteUsersValidationRules = [
    ...deleteValidationRules,
    body('userIds').exists().isArray()
]