import { Model, ModelObject } from 'objection';

export class BusinessPhoneNumber extends Model {
    businessId!: string;
    phoneNumber!: string;

    static tableName = 'BusinessPhoneNumber';
    static idColumn = ['businessId', 'phoneNumber']
}

export type BusinessPhoneNumberModel = ModelObject<BusinessPhoneNumber>