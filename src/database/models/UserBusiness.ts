import { Model, ModelObject } from 'objection';

export class UserBusiness extends Model {
    userId!: string;
    businessId!: string;

    static tableName = 'UserBusiness';
}

export type UserBusinessModel = ModelObject<UserBusiness>