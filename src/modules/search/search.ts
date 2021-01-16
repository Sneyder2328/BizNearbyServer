import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { endpoints } from '../../utils/constants/endpoints';
import { AuthError } from '../../utils/errors/AuthError';
import { authenticate } from '../../middlewares/authenticate';
import { searchLocations } from './searchService';
const router = Router();

router.get(endpoints.LOCATION_AUTOCOMPLETE, authenticate, handleErrorAsync(async (req, res) => {
    const searchPattern = req.query['query'];
    console.log(searchPattern);
    const { searchResult } = await searchLocations(searchPattern, req.userId);
    res.json(searchResult);
}))

export { router as searchRouter }
