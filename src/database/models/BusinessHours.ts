import { Model, ModelObject } from 'objection'

export class BusinessHours extends Model {
    businessId!: string;
    day!: number;
    openTime!: number;
    closeTime!: number;

    static tableName = 'BusinessHours';
    static idColumn = ['businessId', 'day', 'openTime', 'closeTime']
}

export type BusinessHoursModel = ModelObject<BusinessHours>