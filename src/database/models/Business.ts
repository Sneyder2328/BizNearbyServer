import { Model } from 'objection';

export class Business extends Model {
    id!: string;
    name!: string;
    bannerUrl!: string;
    description!: string;

    static tableName = 'Business';
}