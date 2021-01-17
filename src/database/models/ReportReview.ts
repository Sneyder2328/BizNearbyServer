import { Model, ModelObject} from 'objection';

export class ReportReview extends Model{
    userId!: string;
    reportId!: string;
    analysis!: string|null;

    static tableName = 'ReportReview';
    static idName = ['userId','reportId']; 
}

export type ReportObject = ModelObject<ReportReview>