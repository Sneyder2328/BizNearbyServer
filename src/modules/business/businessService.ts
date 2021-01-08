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
import { User } from '../../database/models/User';


export const newBusiness = async (business) => {
    const {userId, businessId, addressId, name, description, address, latitude, longitude, cityCode, stateCode, countryCode, bannerUrl, hours, phoneNumbers, categories, role} = business;

    const user = await User.query().findOne('id', userId);
    if(!user) throw new AppError(httpCodes.NOT_FOUND, errors.NOT_FOUND, errors.message.USER_NOT_FOUND);

    await Business.query().insert({id: businessId, name, bannerUrl, description});
    await UserBusiness.query().insert({userId, businessId, role});

    const businessAddress = {id: addressId, businessId, address, cityCode, stateCode, countryCode, latitude, longitude};
    await BusinessAddress.query().insert(businessAddress);
    const businessCategory = categories.map(async (categoryCode) => {
        await BusinessCategory.query().insert({businessId, categoryCode});
    });
    const businessHours = hours.map(async ({day, openTime, closeTime}) => {
        const openTimeInt = parseInt(openTime.replace(':', ''), 10);
        const closeTimeInt = parseInt(closeTime.replace(':',''), 10);
        await BusinessHours.query().insert({businessId, day, openTime: openTimeInt, closeTime: closeTimeInt});
    });
    if(phoneNumbers.length > 0){
        const businessPhoneNumber = phoneNumbers.map(async (phoneNumber) => {
            await BusinessPhoneNumber.query().insert({businessId, phoneNumber});
        });
        await Promise.all(businessPhoneNumber);
    }
    await Promise.all(businessCategory);
    await Promise.all(businessHours);

    return {userId, businessId, addressId, name, description, address, latitude, longitude, cityCode, stateCode, countryCode, bannerUrl, hours, phoneNumbers, categories, role};
};