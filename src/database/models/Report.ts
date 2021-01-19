import { Model, ModelObject} from 'objection';

export class Report extends Model{
    id!: string;
    userId!: string;
    businessId!: string;
    title!: string|null;
    description!: string|null;
    reviewedAt!: Date;

    static tableName = 'Report';
    static idName = 'id'; 
}

export type ReportObject = ModelObject<Report>