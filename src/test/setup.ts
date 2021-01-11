import {User} from '../database/models/User';
import { Business } from '../database/models/Business';
import { BusinessAddress } from '../database/models/BusinessAddress';
import { BusinessCategory } from '../database/models/BusinessCategory';
import { BusinessHours } from '../database/models/BusinessHours';
import { BusinessImage } from '../database/models/BusinessImage';
import { BusinessPhoneNumber } from '../database/models/BusinessPhoneNumber';
import { UserBusiness } from '../database/models/UserBusiness';

export async function wipeOutDatabase(){
    await User.query().delete();
    await Business.query().delete();
    await UserBusiness.query().delete();
    await BusinessAddress.query().delete();
    await BusinessCategory.query().delete();
    await BusinessHours.query().delete();
    await BusinessImage.query().delete();
    await BusinessPhoneNumber.query().delete();
    await User.query().insert({id: 'ebf9b67a-50a4-439b-9af6-25dd7ff4810f', fullname: 'Kevin Cheng', email: 'kevin@gmail.com', password: '12345678', typeLogin: 'email', typeUser: 'normal'});
}

export async function CreateUser(user){
    delete user?.googleAuth;
    delete user?.facebookAuth;
    
    await User.query().insert(user);
}

export async function CreateBusiness(business){
    await Business.query().insert(business);
}

export async function CreateUserBusiness(userBusiness){
    await UserBusiness.query().insert(userBusiness);
}

export async function CreateBusinessAddress(businessAddress){
    await BusinessAddress.query().insert(businessAddress);
}

export async function CreateBusinessCategory(businessCategory){
    await BusinessCategory.query().insert(businessCategory);
}

export async function CreateBusinessHours(businessHours){
    await BusinessHours.query().insert(businessHours);
}

export async function CreateBusinessImage(businessImage){
    await BusinessImage.query().insert(businessImage);
}

export async function CreateBusinessPhoneNumber(businessPhoneNumber){
    await BusinessPhoneNumber.query().insert(businessPhoneNumber);
}