import { Model, ModelObject } from 'objection';

export class City extends Model {
    code!: number;
    stateCode!: number;
    name!: string;

    static tableName = "City";
    static idColumn = "code";
}

export type CityObject = ModelObject<City>