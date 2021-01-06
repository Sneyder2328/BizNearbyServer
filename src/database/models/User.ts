import {Model} from 'objection';
import {hashPassword} from '../../utils/utils';

export class User extends Model {
    id!: string;
    fullname!: string;
    email!: string;
    phoneNumber!: string;
    thumbnailUrl!: string;
    password!: string | null;
    typeUser!: "moderator" | "normal";
    typeLogin!: "email" | "facebook" | "google";

    async $beforeInsert(context){
        console.log(this.password);
        if(this.password){
            this.password = await hashPassword(10, this.password);
        }
    }

    static tableName = "User";
}
