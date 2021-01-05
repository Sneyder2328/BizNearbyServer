import {Router} from 'express';
import { userRouter } from './user/user';
const router = Router();

router.use('/', userRouter);

export default router;