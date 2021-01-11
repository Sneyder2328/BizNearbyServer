import { Model, ModelObject } from 'objection';

export class BusinessAddress extends Model {
    id!: string;
    businessId!: string;
    address!: string;
    cityCode!: number;
    stateCode!: number;
    countryCode!: number;
    latitude!: number;
    longitude!: number;

    static tableName = 'BusinessAddress';
    static idColumn = 'id';
}

export type BusinessAddressObject = ModelObject<BusinessAddress> 