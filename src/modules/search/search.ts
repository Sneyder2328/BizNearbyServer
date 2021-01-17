import { Router } from 'express';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { endpoints } from '../../utils/constants/endpoints';
import { authenticate } from '../../middlewares/authenticate';
import { searchLocations } from './searchService';
import { AppError } from '../../utils/errors/AppError';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
const router = Router();

router.get(endpoints.LOCATION_AUTOCOMPLETE, authenticate, handleErrorAsync(async (req, res) => {
    let searchPattern = req.query['query'];
    if(!searchPattern) throw new AppError(httpCodes.BAD_REQUEST);
    const limit = req.query['limit']?req.query['limit']:20;
    searchPattern = searchPattern.trim().replace(/\s\s+/g, ' ');
    const searchResult = await searchLocations(searchPattern, req.userId, limit);
    res.json(searchResult);
}))

export { router as searchRouter }
