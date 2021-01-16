import { Router } from 'express';
import { userRouter } from './user/user';
import { businessRouter } from './business/business';
import { errorHandler } from '../middlewares/errorHandler';
import { moderatorRouter } from './moderator/moderator';
import { reportRouter } from './report/report';
import { searchRouter } from './search/search';

const router = Router();

router.use('/', userRouter);
router.use('/', businessRouter);
router.use('/', moderatorRouter);
router.use('/', reportRouter);
router.use('/', searchRouter);
router.use(errorHandler)

export default router;