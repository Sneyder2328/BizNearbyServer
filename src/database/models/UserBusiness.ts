import { Model } from 'objection';

export class UserBusiness extends Model {
    userId!: string;
    businessId!: string;
    role!: 'owner' | 'admin';

    static tableName = 'UserBusiness';
}