import { Router } from 'express';
import { userRouter } from './user/user';
import { businessRouter } from './business/business';
import { errorHandler } from '../middlewares/errorHandler';

const router = Router();

router.use('/', userRouter);
router.use('/', businessRouter);
router.use(errorHandler);

export default router;