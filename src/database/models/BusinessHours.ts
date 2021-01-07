import { Model } from 'objection'

export class BusinessHours extends Model {
    businessId!: string;
    day!: number;
    openTime!: number;
    closeTime!: number;

    static tableName = 'BusinessHours';
}