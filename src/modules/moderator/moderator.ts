import { Router } from 'express';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { endpoints } from '../../utils/constants/endpoints';
import { authenticate } from '../../middlewares/authenticate';
import { changeModerator, allModerators } from './moderatorService';
import { verifyUserType } from '../../middlewares/verifyUserType';

const router = Router();

/**
 * Give moderator role to user
 */
router.post(endpoints.moderator.CREATE_MODERATOR, authenticate, verifyUserType('admin'), handleErrorAsync(async (req, res) => {
    const updated = await changeModerator(req.params.moderatorId, 'moderator');
    res.json({ updated })
}))

/**
 * Remove moderator role of an user
 */
router.delete(endpoints.moderator.REMOVE_MODERATOR, authenticate, verifyUserType('admin'), handleErrorAsync(async (req, res) => {
    const updated = await changeModerator(req.params.moderatorId, 'normal');
    res.json({ updated });
}))

/**
 * Get all moderators
 */
router.get(endpoints.moderator.GET_MODERATOR, authenticate, verifyUserType('admin'), handleErrorAsync(async (req,res) => {
    const moderators = await allModerators();
    res.json(moderators);
}));

export {router as moderatorRouter}