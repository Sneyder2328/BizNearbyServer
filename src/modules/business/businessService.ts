import { errors } from '../../utils/constants/errors';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import { AppError } from '../../utils/errors/appError';
import { Business } from '../../database/models/Business';
import { BusinessAddress } from '../../database/models/BusinessAddress';
import { BusinessCategory } from '../../database/models/BusinessCategory';
import { BusinessHours } from '../../database/models/BusinessHours';
import { BusinessImage } from '../../database/models/BusinessImage';
import { BusinessPhoneNumber } from '../../database/models/BusinessPhoneNumber';
import { UserBusiness } from '../../database/models/UserBusiness';


export const newBusiness = async (business) => {
    const {userId, businessId, addressId, name, description, address, latitude, longitude, cityCode, stateCode, countryCode, bannerUrl, hours, phoneNumbers, categories, role} = business;
    // PARA VER EL JSON
    console.log(business);

    const businessAddress = {id: addressId, businessId, address, cityCode, stateCode, countryCode, latitude, longitude};
    const businessCategory = categories.map(async (categoryCode) => {
        BusinessCategory.query().insert({businessId, categoryCode});
    });
    const businessPhoneNumber = phoneNumbers.map(async (phoneNumber) => {
        BusinessPhoneNumber.query().insert({businessId, phoneNumber});
    });
    const businessHours = hours.map(async ({day, openTimeString, closeTimeString}) => {
        var openTime = parseInt(openTimeString.replace(':', ''), 10);
        var closeTime = parseInt(closeTimeString.replace(':',''), 10);
        BusinessHours.query().insert({businessId, day, openTime, closeTime});
    });

    await Business.query().insert({id: businessId, name, bannerUrl, description});
    await BusinessAddress.query().insert(businessAddress);
    await Promise.all(businessCategory);
    await Promise.all(businessPhoneNumber);
    await Promise.all(businessHours);
    await UserBusiness.query().insert({userId, businessId, role});

    return {userId, businessId, addressId, name, description, address, latitude, longitude, cityCode, stateCode, countryCode, bannerUrl, hours, phoneNumbers, categories, role};
};