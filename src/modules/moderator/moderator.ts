import { Router } from 'express';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { endpoints } from '../../utils/constants/endpoints';
import { authenticate } from '../../middlewares/authenticate';
import { createModerator } from './moderatorService';
import { verifyUserType } from '../../middlewares/verifyUserType';

const router = Router();

router.post(endpoints.moderator.CREATE_MODERATOR, authenticate, verifyUserType('admin'), handleErrorAsync(async (req, res) => {
    const updated = await createModerator(req.params.moderatorId);
    res.json({ updated })
}))

export {router as moderatorRouter}