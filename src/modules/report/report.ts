import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { reportValidationRules } from './reportRules';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { getReport, newReport } from './reportService';
import { authenticate } from '../../middlewares/authenticate';
import { endpoints } from '../../utils/constants/endpoints';
import { verifyUserType } from '../../middlewares/verifyUserType';

const router = Router();

router.post('/reports', authenticate, reportValidationRules, validate, handleErrorAsync( async (req,res) => {
    const report = req.body;
    const reportCreated = await newReport({...report, userId: req.userId});
    res.json(reportCreated);
}));

router.get(endpoints.report.GET_REPORTS, authenticate, handleErrorAsync( async (req, res)=>{
    const reports = await getReport(req.userId);
    res.json(reports);
}))

export {router as reportRouter}