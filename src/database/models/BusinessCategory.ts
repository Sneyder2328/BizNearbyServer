import { Model, ModelObject } from 'objection';

export class BusinessCategory extends Model {
    businessId!: string;
    categoryCode!: number;

    static tableName = 'BusinessCategory';
}

export type BusinessCategoryModel = ModelObject<BusinessCategory>