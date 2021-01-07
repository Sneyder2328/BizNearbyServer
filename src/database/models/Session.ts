import {Model} from 'objection';

export class Session extends Model {
    token!: string;
    userId!: string;

    static tableName= "Session";
}