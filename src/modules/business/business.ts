import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { newBusinessValidationRules, updateBusinessValidationRules, paramBusinessIdValidationRules, businessReviewValidationRules } from './businessRules';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { addNewBusiness, updateBusiness, deleteBusiness, businessesByUser, businessById, allCategories, reviewBusiness } from './businessService';
import { authenticate } from '../../middlewares/authenticate';
import { endpoints } from '../../utils/constants/endpoints';

const router = Router();

/**
 * Register a Business
 */
router.post(endpoints.users.owner.BUSINESS_REGISTER, authenticate, newBusinessValidationRules, validate, handleErrorAsync(async (req, res) => {
    const business = req.body;
    const newBusiness = await addNewBusiness({...business, userId: req.userId});
    res.json(newBusiness);
}));

/**
 * Update a Business
 */
router.put(endpoints.users.owner.BUSINESS_UPDATE, authenticate, updateBusinessValidationRules, validate, handleErrorAsync(async (req,res) => {
    const business = req.body;
    const businessUpdated = await updateBusiness({...business, userId: req.userId, businessId: req.params.businessId});
    res.json(businessUpdated);
}));

/**
 * Delete a Business
 */
router.delete(endpoints.users.owner.BUSINESS_DELETE, authenticate, paramBusinessIdValidationRules, validate, handleErrorAsync(async (req, res) => {
    const isBusinessDeleted = await deleteBusiness(req.userId, req.params.businessId);
    res.json({businessDeleted: isBusinessDeleted});
}));

/**
 * Get all Business of the owner
 */
router.get(endpoints.users.owner.GET_ALL_BUSINESSES, authenticate, validate, handleErrorAsync(async (req,res) => {
    const businesses = await businessesByUser(req.params.userId, req.userId);
    res.json(businesses);
}));

/**
 * Get business
 */
router.get(endpoints.GET_BUSINESS, authenticate, paramBusinessIdValidationRules, validate, handleErrorAsync(async (req,res) => {
    const business = await businessById(req.params.businessId);
    res.json(business);
}));

/**
 * Get all categories available
 */
router.get(endpoints.users.owner.GET_ALL_CATEGORIES, authenticate, validate, handleErrorAsync(async (req,res) => {
    const categories = await allCategories();
    res.json(categories);
}));

/**
 * Create Business Review
 */
router.post(endpoints.businessReview.CREATE_BUSINESS_REVIEW, authenticate, businessReviewValidationRules, validate, handleErrorAsync(async (req, res) => {
    const {businessId, rating, description} = req.body;
    const {userId} = req;
    const { review } = await reviewBusiness({businessId, rating, description, userId});
    res.json({...review});
}))

export { router as businessRouter }
