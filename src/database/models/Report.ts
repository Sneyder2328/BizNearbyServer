import { Model, ModelObject} from 'objection';

export class Report extends Model{
    id!: string;
    userId!: string;
    businessId!: string;
    checkedBy!: string;
    title!: string;
    description!: string;

    static tableName = 'Report';
    static idName = 'id'; 
}

export type ReportObject = ModelObject<Report>