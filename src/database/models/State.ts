import { Model, ModelObject } from 'objection';

export class State extends Model {
    code!: number;
    countryCode!: number;
    name!: string;

    static tableName = "State";
    static idColumn = "code";
}

export type StateObject = ModelObject<State>