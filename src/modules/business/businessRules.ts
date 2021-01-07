import config from '../../config/config';
import { body, header, param } from 'express-validator';

const trimInside = () => str => str.replace(/\s\s/g, ' ');

export const newBusinessValidationRules = [
    body('userId').trim().matches(config.regex.uuidV4).withMessage('Invalid Id'),
    body('businessId').trim().matches(config.regex.uuidV4).withMessage('Invalid Id'),
    body('addresId').trim().matches(config.regex.uuidV4).withMessage('Invalid Id'),
    body('name').customSanitizer(trimInside()).escape().isString().isLength({min: 1, max: 250}).withMessage('Name must be at least 1 character long'),
    body('description').customSanitizer(trimInside()).escape().isString().optional({nullable: true}).isLength({min: 1, max: 500}).withMessage('Description must be at least 1 character long'),
    body('address').customSanitizer(trimInside()).escape().isString().optional({nullable: true}).isLength({min: 1, max: 250}).withMessage('Addres mus be at least 1 character long'),
    body('bannerUrl').trim().isString().escape().optional({nullable: true}),
    body('role')
        .custom(val => val === 'admin' || val === 'owner').withMessage('You must provide a valid role of user(admin, owner)').optional({nullable: true}),
    body('latitude').isNumeric(),
    body('longitude').isNumeric(),
    body('cityCode').isNumeric(),
    body('stateCode').isNumeric(),
    body('countryCode').isNumeric(),
    body('hours').custom(obj => typeof obj.day === 'number' && obj.day <= 7 && typeof obj.openTime === 'string' && obj.openTime.length <= 5 && typeof obj.closeTime === 'string' && obj.closeTime.length <= 5),
    body('phoneNumber').custom(val => {
        for(let i = 0; i < val; i++){
            if(typeof val[i] !== 'string' && val[i].length > 50){
                return false
            }
        }
        return true;
    }).optional({nullable: true}),
    body('categories').custom(val => {
        for(let i = 0; i<val;i++){
            if(typeof val[i] !== 'number' && val[i] > 99999){
                return false
            }
        }
        return true;
    }),
];