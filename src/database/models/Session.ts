import {Model, ModelObject} from 'objection';

export class Session extends Model {
    token!: string;
    userId!: string;
    createdAt!:Date;

    static tableName= "Session";
}

export type SessionObject = ModelObject<Session>