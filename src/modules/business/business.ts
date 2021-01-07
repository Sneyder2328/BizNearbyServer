import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { newBusinessValidationRules } from './businessRules';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { newBusiness } from './businessService';
import { endpoints } from '../../utils/constants/endpoints';
import config from '../../config/config';

const router = Router();

router.post('/businesses', newBusinessValidationRules, validate, handleErrorAsync(async (req,res) => {
    const business = req.body;
    const {userId, businessId, addressId, name, description, address, latitude, longitude, cityCode, stateCode, countryCode, bannerUrl, hours, phoneNumbers, categories, role} = await newBusiness(business);
    res.json({userId, businessId, addressId, name, description, address, latitude, longitude, cityCode, stateCode, countryCode, bannerUrl, hours, phoneNumbers, categories, role});
}))
