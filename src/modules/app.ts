import { Router } from 'express';
import { userRouter } from './user/user';
import { businessRouter } from './business/business';
import { errorHandler } from '../middlewares/errorHandler';
import { moderatorRouter } from './moderator/moderator';

const router = Router();

router.use('/', userRouter);
router.use('/', businessRouter);
router.use('/', moderatorRouter);
router.use(errorHandler)

export default router;