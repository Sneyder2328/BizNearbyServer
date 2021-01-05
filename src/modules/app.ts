import {Router} from 'express';
import Home from './home/welcome';
const router = Router();

router.use('/', Home);

export default router;