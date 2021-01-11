import { Model, ModelObject } from 'objection';

export class BusinessPhoneNumber extends Model {
    businessId!: string;
    phoneNumber!: string;

    static tableName = 'BusinessPhoneNumber';
}

export type BusinessPhoneNumberModel = ModelObject<BusinessPhoneNumber>