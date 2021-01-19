import { Router } from 'express';
import cloudinaryStorage from "multer-storage-cloudinary";
import multer from "multer";
import { cloudinary } from "../../config/cloudinaryConfig";
import { validate } from '../../middlewares/validate';
import { newBusinessValidationRules, updateBusinessValidationRules, paramBusinessIdValidationRules, businessReviewValidationRules } from './businessRules';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { addNewBusiness, updateBusiness, deleteBusiness, businessesByUser, businessById, allCategories, reviewBusiness, editReviewBusiness } from './businessService';
import { authenticate } from '../../middlewares/authenticate';
import { endpoints } from '../../utils/constants/endpoints';
import { MAX_IMG_FILE_SIZE } from '../../utils/constants';
import { AppError } from '../../utils/errors/AppError';
import { httpCodes } from '../../utils/constants/httpResponseCodes';

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

router.post(endpoints.users.owner.BUSINESS_REGISTER, authenticate, newBusinessValidationRules, validate, handleErrorAsync(async (req, res) => {
    const business = req.body;
    const newBusiness = await addNewBusiness({ ...business, userId: req.userId });
    res.json(newBusiness);
}));

router.put(endpoints.users.owner.BUSINESS_UPDATE, authenticate, updateBusinessValidationRules, validate, handleErrorAsync(async (req, res) => {
    const business = req.body;
    const businessUpdated = await updateBusiness({ ...business, userId: req.userId, businessId: req.params.businessId });
    res.json(businessUpdated);
}));

router.delete(endpoints.users.owner.BUSINESS_DELETE, authenticate, paramBusinessIdValidationRules, validate, handleErrorAsync(async (req, res) => {
    const isBusinessDeleted = await deleteBusiness(req.userId, req.params.businessId);
    res.json({ businessDeleted: isBusinessDeleted });
}));

router.get(endpoints.users.owner.GET_ALL_BUSINESSES, authenticate, validate, handleErrorAsync(async (req, res) => {
    const businesses = await businessesByUser(req.params.userId, req.userId);
    res.json(businesses);
}));

router.get(endpoints.GET_BUSINESS, authenticate, paramBusinessIdValidationRules, validate, handleErrorAsync(async (req, res) => {
    const business = await businessById(req.params.businessId);
    res.json(business);
}));

router.get(endpoints.users.owner.GET_ALL_CATEGORIES, authenticate, validate, handleErrorAsync(async (req, res) => {
    const categories = await allCategories();
    res.json(categories);
}));

router.post(endpoints.businessReview.CREATE_BUSINESS_REVIEW, authenticate, businessReviewValidationRules, validate, handleErrorAsync(async (req, res) => {
    const { businessId, rating, description } = req.body;
    const { userId } = req;
    const { review } = await reviewBusiness({ businessId, rating, description, userId });
    res.json({ ...review });
}));

router.put(endpoints.businessReview.UPDATE_BUSINESS_REVIEW, authenticate, businessReviewValidationRules, validate, handleErrorAsync(async (req, res) => {
    const businessReview = req.body;
    const { review } = await editReviewBusiness({...businessReview, userId: req.userId});
    res.json({...review});
}));

export { router as businessRouter }
