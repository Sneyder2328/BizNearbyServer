import { Router } from 'express';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { endpoints } from '../../utils/constants/endpoints';
import { authenticate } from '../../middlewares/authenticate';
import { searchLocations } from './searchService';
const router = Router();

router.get(endpoints.LOCATION_AUTOCOMPLETE, authenticate, handleErrorAsync(async (req, res) => {
    let searchPattern = req.query['query'];
    searchPattern = searchPattern.trim();
    const searchResult = await searchLocations(searchPattern, req.userId);
    res.json(searchResult);
}))

export { router as searchRouter }
