import config from '../../config/config';
import { body, param } from 'express-validator';

const trimInside = () => str => str.replace(/\s\s/g, ' ');

const timeRegex = /^[0|1|2]\d:\d{2}$/;

const businessValidationRules = [
    body('addressId').trim().matches(config.regex.uuidV4).withMessage('Invalid addressId'),
    body('name').customSanitizer(trimInside()).escape().isString().isLength({ min: 1, max: 250 }).withMessage('Name must be at least 1 character long'),
    body('description').customSanitizer(trimInside()).escape().isString().optional({ nullable: true }).isLength({ min: 1, max: 500 }).withMessage('Description must be at least 1 character long'),
    body('address').customSanitizer(trimInside()).escape().isString().optional({ nullable: true }).isLength({ min: 1, max: 250 }).withMessage('Addres mus be at least 1 character long'),
    body('bannerUrl').trim().isString().escape().optional({ nullable: true }),
    body('latitude').isNumeric(),
    body('longitude').isNumeric(),
    body('cityCode').isNumeric().optional({ nullable: true }),
    body('stateCode').isNumeric().optional({ nullable: true }),
    body('countryCode').isNumeric().optional({ nullable: true }),
    body('hours').custom(arr => {
        for (let i = 0; i < arr.length; i++) {
            if (typeof arr[i].day !== 'number' || arr[i].day > 7 || !timeRegex.test(arr[i].openTime) || !timeRegex.test(arr[i].closeTime))
                return false;
        }
        return true;
    }),
    body('phoneNumbers').custom(val => {
        for (let i = 0; i < val.length; i++) {
            if (typeof val[i] !== 'string' || val[i].length > 50) {
                return false;
            }
        }
        return true;
    }).optional({ nullable: true }),
    body('categories').custom(val => {
        for (let i = 0; i < val.length; i++) {
            if (typeof val[i] !== 'number' || val[i] > 99999) {
                return false;
            }
        }
        return true;
    })
]

export const newBusinessValidationRules = [
    body('businessId').trim().matches(config.regex.uuidV4).withMessage('Invalid businessId'),
    ...businessValidationRules
];


export const updateBusinessValidationRules = [
    param('businessId').trim().matches(config.regex.uuidV4).withMessage('Invalid businessId'),
    body('emailNewUser').isEmail().normalizeEmail().withMessage('You must enter a valid email address')
        .isLength({ max: 250 }).withMessage('email too long').optional({nullable: true}),
    ...businessValidationRules
];

export const paramBusinessIdValidationRules = [
    param('businessId').trim().matches(config.regex.uuidV4).withMessage('Invalid businessId')
];
