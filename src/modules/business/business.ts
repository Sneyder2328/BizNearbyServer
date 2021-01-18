import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { newBusinessValidationRules, updateBusinessValidationRules, paramBusinessIdValidationRules, businessReviewValidationRules } from './businessRules';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { addNewBusiness, updateBusiness, deleteBusiness, businessesByUser, businessById, allCategories, reviewBusiness, editReviewBusiness } from './businessService';
import { authenticate } from '../../middlewares/authenticate';
import { endpoints } from '../../utils/constants/endpoints';

const router = Router();

router.post(endpoints.users.owner.BUSINESS_REGISTER, authenticate, newBusinessValidationRules, validate, handleErrorAsync(async (req, res) => {
    const business = req.body;
    const newBusiness = await addNewBusiness({...business, userId: req.userId});
    res.json(newBusiness);
}));

router.put(endpoints.users.owner.BUSINESS_UPDATE, authenticate, updateBusinessValidationRules, validate, handleErrorAsync(async (req,res) => {
    const business = req.body;
    const businessUpdated = await updateBusiness({...business, userId: req.userId, businessId: req.params.businessId});
    res.json(businessUpdated);
}));

router.delete(endpoints.users.owner.BUSINESS_DELETE, authenticate, paramBusinessIdValidationRules, validate, handleErrorAsync(async (req, res) => {
    const isBusinessDeleted = await deleteBusiness(req.userId, req.params.businessId);
    res.json({businessDeleted: isBusinessDeleted});
}));

router.get(endpoints.users.owner.GET_ALL_BUSINESSES, authenticate, validate, handleErrorAsync(async (req,res) => {
    const businesses = await businessesByUser(req.params.userId, req.userId);
    res.json(businesses);
}));

router.get(endpoints.GET_BUSINESS, authenticate, paramBusinessIdValidationRules, validate, handleErrorAsync(async (req,res) => {
    const business = await businessById(req.params.businessId);
    res.json(business);
}));

router.get(endpoints.users.owner.GET_ALL_CATEGORIES, authenticate, validate, handleErrorAsync(async (req,res) => {
    const categories = await allCategories();
    res.json(categories);
}));

router.post(endpoints.businessReview.CREATE_BUSINESS_REVIEW, authenticate, businessReviewValidationRules, validate, handleErrorAsync(async (req, res) => {
    const {businessId, rating, description} = req.body;
    const {userId} = req;
    const { review } = await reviewBusiness({businessId, rating, description, userId});
    res.json({...review});
}));

router.put(endpoints.businessReview.UPDATE_BUSINESS_REVIEW, authenticate, businessReviewValidationRules, validate, handleErrorAsync(async (req, res) => {
    const businessReview = req.body;
    const businessReviewUpdated = await editReviewBusiness({...businessReview, userId: req.userId});
    res.json({...businessReviewUpdated});
}));

export { router as businessRouter }
