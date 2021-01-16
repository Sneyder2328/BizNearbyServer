import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { reportValidationRules } from './reportRules';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { newReport } from './reportService';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

router.post('/reports', authenticate, reportValidationRules, validate, handleErrorAsync( async (req,res) => {
    const report = req.body;
    const reportCreated = await newReport({...report, userId: req.userId});
    res.json(reportCreated);
}));

export {router as reportRouter}