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
    await User.query().delete();
    await Business.query().delete();
    await UserBusiness.query().delete();
    await BusinessAddress.query().delete();
    await BusinessCategory.query().delete();
    await BusinessHours.query().delete();
    await BusinessImage.query().delete();
    await BusinessPhoneNumber.query().delete();
}    
export async function createUser({id, fullname, email, password, typeLogin, typeUser}:{id: string; fullname: string; email: string; password: string; typeLogin: "email" | "facebook" | "google"; typeUser: "moderator" | "normal" | "admin";}){
    //delete user?.googleAuth;
    // delete user?.facebookAuth;
    
    await User.query().insert({id, fullname, email, password, typeLogin, typeUser});
}

export async function createBusiness({id, name, description, bannerUrl}:{id: string; name: string; description: string; bannerUrl: string;}){
    await Business.query().insert({id, name, description, bannerUrl});
}

export async function createSession({token, userId}:{token: string; userId: string}){
    await Session.query().insert({token, userId});
}

export async function createUserBusiness({userId, businessId}:{userId: string; businessId: string}){
    await UserBusiness.query().insert({userId, businessId});
}

export async function createBusinessAddress({id, businessId, address, cityCode, stateCode, countryCode, latitude, longitude}:{id: string; businessId: string; address: string; cityCode: number; stateCode: number; countryCode: number; latitude: number; longitude: number;}){
    await BusinessAddress.query().insert({id, businessId, cityCode, stateCode, countryCode, latitude, longitude});
}

export async function createBusinessCategory({businessId, categoryCode}:{businessId: string; categoryCode: number}){
    await BusinessCategory.query().insert({businessId, categoryCode});
}

export async function createBusinessHours(businessHours){
    const hours = businessHours.map(async ({day, openTime, closeTime}) => {
        await BusinessHours.query().insert({businessId: "a8bcd05e-4606-4a55-a5dd-002f8516493e", day, openTime, closeTime});
    });
}

export async function createBusinessImage(businessImage){
    await BusinessImage.query().insert(businessImage);
}

export async function createBusinessPhoneNumber({businessId, phoneNumber}:{businessId: string; phoneNumber: string}){
    await BusinessPhoneNumber.query().insert({businessId, phoneNumber});
}

export async function insertBusinessData(){
    await createUser({id: 'ebf9b67a-50a4-439b-9af6-25dd7ff4810f', fullname: 'Kevin Cheng', email: 'kevin@gmail.com', password: '12345678', typeLogin: 'email', typeUser: 'normal'});
    await createUser({id: 'f94bcebf-f181-447b-b85f-3c5f36c2a269', fullname: 'Andres Alvarez', email: 'andres@gmail.com', password: '12345678', typeLogin: 'email', typeUser: 'normal'});
    await createSession({token: 'fcd84d1f-ee1b-4636-9f61-78dc349f23e5', userId: 'ebf9b67a-50a4-439b-9af6-25dd7ff4810f'});
    await createSession({token: 'b337e27e-bcf0-4154-8a77-96daa873c9e5', userId: 'f94bcebf-f181-447b-b85f-3c5f36c2a269'});
    await createBusiness({id: "a8bcd05e-4606-4a55-a5dd-002f8516493e", name: "Bodega Mi encanto", description: "My business it's so nice", bannerUrl: "AnURL"});
    await createUserBusiness({userId: 'ebf9b67a-50a4-439b-9af6-25dd7ff4810f', businessId: "a8bcd05e-4606-4a55-a5dd-002f8516493e"});
    await createBusinessAddress({id: "eee15b20-917f-4d69-a055-e306d938d196", businessId: "a8bcd05e-4606-4a55-a5dd-002f8516493e", address: "Calle 50 entre carreras 14 y 15", cityCode: 212, stateCode: 12, countryCode: 862, latitude: 10.059972, longitude: -69.340570});
    await createBusinessCategory({businessId: "a8bcd05e-4606-4a55-a5dd-002f8516493e", categoryCode: 1});
    await createBusinessHours([{
        day: 1,
        openTime: 600,
        closeTime: 1200
    },
    {
        day: 1,
        openTime: 1300,
        closeTime: 1830
    }]);
    await createBusinessPhoneNumber({businessId: "a8bcd05e-4606-4a55-a5dd-002f8516493e", phoneNumber: "04125568177"})
}