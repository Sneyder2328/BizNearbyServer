import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { deleteReportRules, getReportRules, reportRules, reviewReportRules } from './reportRules';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { deleteReport, getReport, newReport, reviewReport } from './reportService';
import { authenticate } from '../../middlewares/authenticate';
import { endpoints } from '../../utils/constants/endpoints';
const router = Router();

/**
 * Create new report
 */
router.post('/reports', authenticate, reportRules, validate, handleErrorAsync( async (req,res) => {
    const report = req.body;
    const reportCreated = await newReport({...report, userId: req.userId});
    res.json(reportCreated);
}));

/**
 * Get reports
 */
router.get(endpoints.report.GET_REPORTS, authenticate, getReportRules, validate, handleErrorAsync( async (req, res)=>{
    const type = req.query.type;
    const reports = await getReport(req.userId, type);
    res.json(reports);
}))

/**
 * Review report
 */
router.post(endpoints.report.REVIEW_REPORT, authenticate, reviewReportRules, validate, handleErrorAsync(async (req, res)=>{
    const {analysis}  = req.body;
    const id = req.params.reportId;
    const reportReviewed = await reviewReport({id, analysis}, req.userId);
    res.json(reportReviewed);
}))

router.delete(endpoints.report.DELETE_REPORT, authenticate, deleteReportRules, validate, handleErrorAsync(async (req, res) => {
    const userId = req.userId;
    const {reportId} = req.params;
    const deleted = await deleteReport(userId, reportId);
    res.json(deleted);
}))

export {router as reportRouter}