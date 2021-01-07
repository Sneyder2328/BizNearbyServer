import {Router} from 'express';
import { userRouter } from './user/user';
import { businessRouter } from './business/business';

const router = Router();

router.use('/', userRouter);
router.use('/', businessRouter);

export default router;