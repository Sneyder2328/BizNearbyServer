import { Model } from 'objection';

export class BusinessCategory extends Model {
    businessId!: string;
    categoryCode!: number;

    static tableName = 'BusinessCategory';
}