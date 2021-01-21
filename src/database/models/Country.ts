import { Model, ModelObject } from 'objection';

export class Country extends Model {
    code!: number;
    name!: string;

    static tableName = "Country";
    static idColumn = "code";
}

export type CountryObject = ModelObject<Country>