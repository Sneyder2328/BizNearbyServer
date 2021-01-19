import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { reportValidationRules, reviewReportValidationRules } from './reportRules';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { getReport, newReport, reviewReport } from './reportService';
import { authenticate } from '../../middlewares/authenticate';
import { endpoints } from '../../utils/constants/endpoints';
const router = Router();

/**
 * Create new report
 */
router.post('/reports', authenticate, reportValidationRules, validate, handleErrorAsync( async (req,res) => {
    const report = req.body;
    const reportCreated = await newReport({...report, userId: req.userId});
    res.json(reportCreated);
}));

/**
 * Get reports
 */
router.get(endpoints.report.GET_REPORTS, authenticate, handleErrorAsync( async (req, res)=>{
    const reports = await getReport(req.userId);
    res.json(reports);
}))

/**
 * Review report
 */
router.post(endpoints.report.REVIEW_REPORT, authenticate, reviewReportValidationRules, validate, handleErrorAsync(async (req, res)=>{
    const {analysis}  = req.body;
    const id = req.params.reportId;
    const { reportReviewed } = await reviewReport({id, analysis}, req.userId);
    res.json({...reportReviewed});
}))

export {router as reportRouter}