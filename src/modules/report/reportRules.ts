import config from '../../config/config';
import { body, param, query } from 'express-validator';

const trimInside = () => (str?: String) => str?.replace(/\s\s/g, ' ');

export const reportRules = [
    body('id').trim().matches(config.regex.uuidV4).withMessage('Invalid id').exists(),
    body('businessId').trim().matches(config.regex.uuidV4).withMessage('Invalid businessId').exists(),
    body('title').customSanitizer(trimInside()).escape().isString().isLength({ min: 1, max: 250 }).withMessage('Title must be at least 1 character long').exists(),
    body('description').customSanitizer(trimInside()).escape().isString().isLength({ min: 1, max: 500 }).withMessage('Description must be at least 1 character long').exists()
];

export const reviewReportRules = [
    body('analysis').customSanitizer(trimInside()).escape().isString().isLength({ min: 1, max: 250 }).withMessage('Analysis must be at least 1 character long').exists()
]

export const getReportRules = [
    query('type').matches(/^(Pending|Reviewed|All)$/).withMessage("Invalid Type")
]