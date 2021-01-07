import { Model } from 'objection';

export class BusinessPhoneNumber extends Model {
    businessId!: string;
    phoneNumber!: string;

    static tableName = 'BusinessPhoneNumber';
}