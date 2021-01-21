import { Router } from 'express';
import cloudinaryStorage from "multer-storage-cloudinary";
import multer from "multer";
import { cloudinary } from "../../config/cloudinaryConfig";
import { validate } from '../../middlewares/validate';
import { newBusinessValidationRules, updateBusinessValidationRules, paramBusinessIdValidationRules, businessReviewValidationRules, addCategoryRules, deleteBusinessReviewRules, getNearbyBusinessesRules } from './businessRules';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { addNewBusiness, updateBusiness, deleteBusiness, businessesByUser, businessById, allCategories, reviewBusiness, editReviewBusiness, addCategory, deleteCategory, deleteReviewBusiness, getBusinessesBySearch, getBusinessByCategory } from './businessService';
import { authenticate } from '../../middlewares/authenticate';
import { endpoints } from '../../utils/constants/endpoints';
import { MAX_IMG_FILE_SIZE } from '../../utils/constants';
import { AppError } from '../../utils/errors/AppError';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import { verifyUserType } from '../../middlewares/verifyUserType';
import { AuthError } from '../../utils/errors/AuthError';

const storage = cloudinaryStorage({
    cloudinary,
    params: {
        folder: 'BusinessImages',
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
const imageUpload = parser.single('businessImage');

const router = Router();

router.post('/businesses/images', authenticate, imageUpload,
    handleErrorAsync(async (req, res) => {
        if (!req.file?.path) {
            throw new AppError(httpCodes.BAD_REQUEST, "No image error", "No valid image has been provided")
        }
        res.json(req.file.path)
    }));

/**
 * Register a Business
 */
router.post(endpoints.users.owner.BUSINESS_REGISTER, authenticate, newBusinessValidationRules, validate, handleErrorAsync(async (req, res) => {
    const business = req.body;
    const newBusiness = await addNewBusiness({ ...business, userId: req.userId });
    res.json(newBusiness);
}));

/**
 * Update a Business
 */
router.put(endpoints.users.owner.BUSINESS_UPDATE, authenticate, updateBusinessValidationRules, validate, handleErrorAsync(async (req,res) => {
    const business = req.body;
    const businessUpdated = await updateBusiness({ ...business, userId: req.userId, businessId: req.params.businessId });
    res.json(businessUpdated);
}));

/**
 * Delete a Business
 */
router.delete(endpoints.users.owner.BUSINESS_DELETE, authenticate, paramBusinessIdValidationRules, validate, handleErrorAsync(async (req, res) => {
    const isBusinessDeleted = await deleteBusiness(req.userId, req.params.businessId);
    res.json({ businessDeleted: isBusinessDeleted });
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
 * Add Category
 */
router.post(endpoints.ADD_CATEGORY, authenticate, verifyUserType('admin'), addCategoryRules, validate, handleErrorAsync(async (req, res) => {
    const { category } = req.body;
    const {categoryInserted} = await addCategory(category);
    res.json({...categoryInserted});
}));

/**
 * Delete Category
 */
router.delete(endpoints.DELETE_CATEGORY, authenticate, verifyUserType('admin'), validate, handleErrorAsync(async (req,res) => {
    const isCategoryDeleted = await deleteCategory(req.params.code);
    res.json({isCategoryDeleted});
}));

/**
 * Create Business Review
 */
router.post(endpoints.businessReview.CREATE_BUSINESS_REVIEW, authenticate, businessReviewValidationRules, validate, handleErrorAsync(async (req, res) => {
    const { businessId, rating, description } = req.body;
    const { userId } = req;
    const { review } = await reviewBusiness({ businessId, rating, description, userId });
    res.json({ ...review });
}));

/**
 * Update Business Review
 */
router.put(endpoints.businessReview.UPDATE_BUSINESS_REVIEW, authenticate, businessReviewValidationRules, validate, handleErrorAsync(async (req, res) => {
    const businessReview = req.body;
    const { review } = await editReviewBusiness({...businessReview, userId: req.userId});
    res.json({...review});
}));

/**
 * Delete Business Review
 */
router.delete(endpoints.businessReview.DELETE_BUSINESS_REVIEW, authenticate, deleteBusinessReviewRules, validate, handleErrorAsync(async (req, res) => {
    const {businessId} = req.body;
    const sessionId = req.userId;
    const userId = req.params.userId;
    const deleted = await deleteReviewBusiness(businessId, userId, sessionId);
    res.json({deleted});
}));

/**
 * Get Businesses
 */
router.get(endpoints.GET_NEARBY_BUSINESSES, getNearbyBusinessesRules, validate, handleErrorAsync(async (req, res) => {
    const {longitude, latitude, radius} = req.query;
    let results;
    if(req.query?.category){
        results = await getBusinessByCategory(req.query.category, latitude, longitude, radius);
    }
    else if(req.query?.query){
        results = await getBusinessesBySearch(latitude, longitude, radius, req.query.query);
    }
    else{
        res.status(httpCodes.UNPROCESSABLE_ENTITY).json({errors: [{"Error":"missing query or category"}]});
    }
    res.json(results);
}))

export { router as businessRouter }
