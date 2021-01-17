import { Model, ModelObject } from 'objection';

export class BusinessImage extends Model {
    businessId!: string;
    imageUrl!: string;

    static tableName = 'BusinessImage';
    static idColumn = ['businessId', 'imageUrl'];
}

export type BusinessImageModel = ModelObject<BusinessImage>