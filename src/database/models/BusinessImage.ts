import { Model } from 'objection';

export class BusinessImage extends Model {
    businessId!: string;
    imageUrl!: string;

    static tableName = 'BusinessImage';
}