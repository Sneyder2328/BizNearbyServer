import { Model, ModelObject } from 'objection'

export class BusinessHours extends Model {
    businessId!: string;
    day!: number;
    openTime!: number;
    closeTime!: number;

    static tableName = 'BusinessHours';
}

export type BusinessHoursModel = ModelObject<BusinessHours>