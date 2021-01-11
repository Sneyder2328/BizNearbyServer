import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { newBusinessValidationRules, updateBusinessValidationRules } from './businessRules';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { addNewBusiness, updateBusiness } from './businessService';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

router.post('/businesses', authenticate, newBusinessValidationRules, validate, handleErrorAsync(async (req, res) => {
    const business = req.body;
    const { userId, businessId, addressId, name, description, address, latitude, longitude, cityCode, stateCode, countryCode, bannerUrl, hours, phoneNumbers, categories} = await addNewBusiness(business);
    res.json({ userId, businessId, addressId, name, description, address, latitude, longitude, cityCode, stateCode, countryCode, bannerUrl, hours, phoneNumbers, categories});
}));

router.put('/businesses/:businessId', authenticate, updateBusinessValidationRules, validate, handleErrorAsync(async (req,res) => {
    const business = req.body;
    const businessUpdated = await updateBusiness(business, req.userId, req.params.businessId);
    res.json(businessUpdated);
}));

export { router as businessRouter }
