import {User} from '../database/models/User';

export async function wipeOutDatabase(){
    await User.query().delete();
}

export async function CreateUser(user){
    await User.query().insert(user);
}