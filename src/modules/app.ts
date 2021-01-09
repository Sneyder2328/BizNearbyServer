import {Router} from 'express';
import { userRouter } from './user/user';
import { businessRouter } from './business/business';
import { ErrorHandler } from '../middlewares/errorHandler';

const router = Router();

router.use('/', userRouter);
router.use('/', businessRouter);

router.use('/', ErrorHandler);
export default router;