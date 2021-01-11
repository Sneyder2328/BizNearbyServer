import { Model, ModelObject } from 'objection';

export class BusinessImage extends Model {
    businessId!: string;
    imageUrl!: string;

    static tableName = 'BusinessImage';
}

export type BusinessImageModel = ModelObject<BusinessImage>