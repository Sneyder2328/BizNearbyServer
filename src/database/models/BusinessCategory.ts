import { Model, ModelObject } from 'objection';

export class BusinessCategory extends Model {
    businessId!: string;
    categoryCode!: number;

    static tableName = 'BusinessCategory';
    static idColumn = ['businessId', 'categoryCode']
}

export type BusinessCategoryModel = ModelObject<BusinessCategory>