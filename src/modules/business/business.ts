import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { newBusinessValidationRules, updateBusinessValidationRules, deleteBusinessValidationRules } from './businessRules';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { addNewBusiness, updateBusiness, deleteBusiness, businessesByUser } from './businessService';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

router.post('/businesses', authenticate, newBusinessValidationRules, validate, handleErrorAsync(async (req, res) => {
    const business = req.body;
    const newBusiness = await addNewBusiness({...business, userId: req.userId});
    res.json(newBusiness);
}));

router.put('/businesses/:businessId', authenticate, updateBusinessValidationRules, validate, handleErrorAsync(async (req,res) => {
    const business = req.body;
    const businessUpdated = await updateBusiness({...business, userId: req.userId, businessId: req.params.businessId});
    res.json(businessUpdated);
}));

router.delete('/businesses/:businessId', authenticate, deleteBusinessValidationRules, validate, handleErrorAsync(async (req, res) => {
    const isBusinessDeleted = await deleteBusiness(req.userId, req.params.businessId);
    res.json({businessDeleted: isBusinessDeleted});
}));

router.get('/businesses/:userId', authenticate, validate, handleErrorAsync(async (req,res) => {
    const businesses = await businessesByUser(req.params.userId, req.userId);
    res.json(businesses);
}));

export { router as businessRouter }
