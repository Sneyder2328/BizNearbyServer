import config from '../../config/config';
import { body, param } from 'express-validator';

const trimInside = () => (str?: String) => str?.replace(/\s\s/g, ' ');

const timeRegex = /^[0|1|2]\d:\d{2}$/;

const businessValidationRules = [
    body('address.id').trim().matches(config.regex.uuidV4).withMessage('Invalid addressId').exists(),
    body('name').customSanitizer(trimInside()).escape().isString().isLength({ min: 1, max: 250 }).withMessage('Name must be at least 1 character long').exists(),
    body('description').customSanitizer(trimInside()).escape().isString().optional({ nullable: true }).isLength({ min: 1, max: 500 }).withMessage('Description must be at least 1 character long'),
    body('address.addres').customSanitizer(trimInside()).escape().isString().optional({ nullable: true }).isLength({ min: 1, max: 250 }).withMessage('Addres mus be at least 1 character long'),
    body('bannerUrl').trim().isString().optional({ nullable: true }),
    body('address.latitude').isNumeric().exists(),
    body('address.longitude').isNumeric().exists(),
    body('address.cityCode').isNumeric().optional({ nullable: true }),
    body('hours').exists().custom(arr => {
        if(arr.length === 0){
            return false;
        }
        for (let i = 0; i < arr.length; i++) {
            if (typeof arr[i].day !== 'number' || arr[i].day > 7 || !timeRegex.test(arr[i].openTime) || !timeRegex.test(arr[i].closeTime))
                return false;
        }
        return true;
    }),
    body('phoneNumbers').custom(arr => {
        for (let i = 0; i < arr.length; i++) {
            if (typeof arr[i] !== 'string' || arr[i].length > 50) {
                return false;
            }
        }
        return true;
    }).optional({ nullable: true }),
    body('categories').exists().custom(arr => {
        if(arr.length === 0){
            return false;
        }
        for (let i = 0; i < arr.length; i++) {
            if (typeof arr[i] !== 'number' || arr[i] > 99999) {
                return false;
            }
        }
        return true;
    }),
    body('images').custom(arr => {
        for (let i = 0; i < arr.length; i++) {
            if (typeof arr[i] !== 'string' || arr[i].length > 500) {
                return false;
            }
        }
        return true;
    }).optional({ nullable: true })
]

export const newBusinessValidationRules = [
    body('businessId').trim().matches(config.regex.uuidV4).withMessage('Invalid businessId').exists(),
    ...businessValidationRules
];


export const updateBusinessValidationRules = [
    param('businessId').trim().matches(config.regex.uuidV4).withMessage('Invalid businessId').exists(),
    body('emailNewUser').isEmail().normalizeEmail().withMessage('You must enter a valid email address')
        .isLength({ max: 250 }).withMessage('email too long').optional({nullable: true}),
    ...businessValidationRules
];

export const paramBusinessIdValidationRules = [
    param('businessId').trim().matches(config.regex.uuidV4).withMessage('Invalid businessId').exists()
];

export const businessReviewValidationRules = [
    body('businessId').trim().matches(config.regex.uuidV4).withMessage('Invalid businessId').exists(),
    body('rating').isNumeric().custom(val => val>=1 && val<=5).withMessage('Invalid rating').exists(),
    body('description').isString().isLength({min: 1, max: 200}).withMessage('Invalid description').exists()
]

export const deleteBusinessReviewRules = [
    body('businessId').trim().matches(config.regex.uuidV4).withMessage('Invalid businessId').exists(),
]

export const addCategoryRules = [
    body('category').isString().isLength({min: 1}).withMessage("Invalid Category")
]