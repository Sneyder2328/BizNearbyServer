import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { newBusinessValidationRules } from './businessRules';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { addNewBusiness } from './businessService';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

router.post('/businesses', authenticate, newBusinessValidationRules, validate, handleErrorAsync(async (req, res) => {
    const business = req.body;
    const { userId, businessId, addressId, name, description, address, latitude, longitude, cityCode, stateCode, countryCode, bannerUrl, hours, phoneNumbers, categories, role } = await addNewBusiness(business);
    res.json({ userId, businessId, addressId, name, description, address, latitude, longitude, cityCode, stateCode, countryCode, bannerUrl, hours, phoneNumbers, categories, role });
}))

export { router as businessRouter }
