import config from '../../config/config';
import { body } from 'express-validator';

const trimInside = () => str => str.replace(/\s\s/g, ' ');

export const reportValidationRules = [
    body('id').trim().matches(config.regex.uuidV4).withMessage('Invalid id'),
    body('businessId').trim().matches(config.regex.uuidV4).withMessage('Invalid businessId'),
    body('title').customSanitizer(trimInside()).escape().isString().isLength({ min: 1, max: 250 }).withMessage('Title must be at least 1 character long'),
    body('description').customSanitizer(trimInside()).escape().isString().isLength({ min: 1, max: 500 }).withMessage('Description must be at least 1 character long')
];