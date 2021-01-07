import { Model } from 'objection';

export class BusinessAddress extends Model {
    id!: string;
    businessId!: string;
    addresss!: string;
    cityCode!: number;
    stateCode!: number;
    countryCode!: number;
    latitude!: number;
    longitude!: number;

    static tableName = 'BusinessAddress';
}