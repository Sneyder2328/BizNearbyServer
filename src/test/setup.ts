import {User} from '../database/models/User';
import { Business } from '../database/models/Business';
import { BusinessAddress } from '../database/models/BusinessAddress';
import { BusinessCategory } from '../database/models/BusinessCategory';
import { BusinessHours } from '../database/models/BusinessHours';
import { BusinessImage } from '../database/models/BusinessImage';
import { BusinessPhoneNumber } from '../database/models/BusinessPhoneNumber';
import { UserBusiness } from '../database/models/UserBusiness';
import { Session } from '../database/models/Session';

export async function wipeOutDatabase(){
    const hours = [{
        day: 1,
        openTime: 600,
        closeTime: 1200
    },
    {
        day: 1,
        openTime: 1300,
        closeTime: 1830
    }];
    await User.query().delete();
    await Business.query().delete();
    await UserBusiness.query().delete();
    await BusinessAddress.query().delete();
    await BusinessCategory.query().delete();
    await BusinessHours.query().delete();
    await BusinessImage.query().delete();
    await BusinessPhoneNumber.query().delete();
    await User.query().insert({id: 'ebf9b67a-50a4-439b-9af6-25dd7ff4810f', fullname: 'Kevin Cheng', email: 'kevin@gmail.com', password: '12345678', typeLogin: 'email', typeUser: 'normal'});
    await User.query().insert({id: 'f94bcebf-f181-447b-b85f-3c5f36c2a269', fullname: 'Andres Alvarez', email: 'andres@gmail.com', password: '12345678', typeLogin: 'email', typeUser: 'normal'});
    await Session.query().insert({token: 'fcd84d1f-ee1b-4636-9f61-78dc349f23e5', userId: 'ebf9b67a-50a4-439b-9af6-25dd7ff4810f'});
    await Session.query().insert({token: 'b337e27e-bcf0-4154-8a77-96daa873c9e5', userId: 'f94bcebf-f181-447b-b85f-3c5f36c2a269'})
    await Business.query().insert({id: "a8bcd05e-4606-4a55-a5dd-002f8516493e", name: "Bodega Mi encanto", description: "My business it's so nice", bannerUrl: "AnURL"});
    await UserBusiness.query().insert({userId: 'ebf9b67a-50a4-439b-9af6-25dd7ff4810f', businessId: "a8bcd05e-4606-4a55-a5dd-002f8516493e"});
    await BusinessAddress.query().insert({id: "eee15b20-917f-4d69-a055-e306d938d196", businessId: "a8bcd05e-4606-4a55-a5dd-002f8516493e", });
    await BusinessCategory.query().insert({businessId: "a8bcd05e-4606-4a55-a5dd-002f8516493e", categoryCode: 1});
    const businessHours = hours.map(async ({day, openTime, closeTime}) => {
        await BusinessHours.query().insert({businessId: "a8bcd05e-4606-4a55-a5dd-002f8516493e", day, openTime, closeTime});
    });
    await Promise.all(businessHours);
    await BusinessPhoneNumber.query().insert({businessId: "a8bcd05e-4606-4a55-a5dd-002f8516493e", phoneNumber: "04125568177"});
 
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