import { Model, ModelObject } from 'objection';

export class UserBusiness extends Model {
    userId!: string;
    businessId!: string;
    role!: 'owner' | 'admin';

    static tableName = 'UserBusiness';
}

export type UserBusinessModel = ModelObject<UserBusiness>