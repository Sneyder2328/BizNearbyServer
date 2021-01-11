import { errors } from '../../utils/constants/errors';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import { AppError } from '../../utils/errors/appError';
import { Business } from '../../database/models/Business';
import { BusinessAddress } from '../../database/models/BusinessAddress';
import { BusinessCategory } from '../../database/models/BusinessCategory';
import { BusinessHours } from '../../database/models/BusinessHours';
import { BusinessPhoneNumber } from '../../database/models/BusinessPhoneNumber';
import { UserBusiness } from '../../database/models/UserBusiness';
import { User } from '../../database/models/User';
import { Session } from '../../database/models/Session';


export const addNewBusiness = async (business) => {
    const {userId, businessId, addressId, name, description, address, latitude, longitude, cityCode, stateCode, countryCode, bannerUrl, hours, phoneNumbers, categories} = business;

    const user = await User.query().findOne('id', userId);
    if(!user) throw new AppError(httpCodes.NOT_FOUND, errors.NOT_FOUND, errors.message.USER_NOT_FOUND);

    await Business.query().insert({id: businessId, name, bannerUrl, description});

    await UserBusiness.query().insert({userId, businessId});

    await BusinessAddress.query().insert({id: addressId, businessId, address, cityCode, stateCode, countryCode, latitude, longitude});
    
    const businessCategory = categories.map(async (categoryCode) => {
        await BusinessCategory.query().insert({businessId, categoryCode});
    });

    const businessHours = hours.map(async ({day, openTime, closeTime}) => {
        const openTimeInt = parseInt(openTime.replace(':', ''), 10);
        const closeTimeInt = parseInt(closeTime.replace(':',''), 10);
        await BusinessHours.query().insert({businessId, day, openTime: openTimeInt, closeTime: closeTimeInt});
    });

    if(phoneNumbers){
        const businessPhoneNumber = phoneNumbers.map(async (phoneNumber) => {
            await BusinessPhoneNumber.query().insert({businessId, phoneNumber});
        });
        await Promise.all(businessPhoneNumber);
    }

    await Promise.all(businessCategory);
    await Promise.all(businessHours);

    return {userId, businessId, addressId, name, description, address, latitude, longitude, cityCode, stateCode, countryCode, bannerUrl, hours, phoneNumbers, categories};
};

/**
 * Verify the user has admin access to the business he's creating/editing the account for
 * @param userId
 * @param businessId
 */
const verifyUserHasAccessToBusiness = async (userId: string, businessId: string) => {
    const userBusiness = (await UserBusiness.query().where('userId', userId).andWhere('businessId', businessId))[0];
    if (!userBusiness) {
        throw new AppError(httpCodes.FORBIDDEN, 'No permission error', 'You do not have admin permission for the given business');
    }
};

export const updateBusiness = async (business, userId, businessId) => {
    const {addressId, emailNewUser, name, description, address, latitude, longitude, cityCode, stateCode, countryCode, bannerUrl, hours, phoneNumbers, categories} = business;

    if(!await Business.query().findOne('id', businessId)) throw new AppError(httpCodes.NOT_FOUND, errors.NOT_FOUND, errors.message.BUSINESS_NOT_FOUND);

    if(!await User.query().findOne('id', userId)) throw new AppError(httpCodes.NOT_FOUND, errors.NOT_FOUND, errors.message.USER_NOT_FOUND);

    // if(!await Session.query().findOne({where: {token: sessionToken, userId}})) throw new AppError(httpCodes.UNAUTHORIZED, errors.CREDENTIAL, errors.message.SESSION_NOT_FOUND);

    verifyUserHasAccessToBusiness(userId, businessId);

    const businessUpdated = await Business.query().patchAndFetchById(businessId, {
        name, bannerUrl, description
    });

    let userAdded;
    if(emailNewUser){
        const userByEmail = await User.query().findOne('email', emailNewUser);
        if(!userByEmail) throw new AppError(httpCodes.NOT_FOUND, errors.USER_NOT_FOUND_ERROR, errors.message.USER_NOT_FOUND);
        else{
            userAdded = await UserBusiness.query().insert({userId: userByEmail.id, businessId});
        }
    }
    
    const businessAddressUpdated = await BusinessAddress.query().patchAndFetchById(addressId, {
        address, cityCode, stateCode, countryCode, latitude, longitude 
    });

    await BusinessCategory.query().delete().where('businessId', '=', businessId);
    let businessCategoriesAdded
    if(categories){
        const businessCategories = categories.map(async (categoryCode) => {
            await BusinessCategory.query().insert({businessId, categoryCode});
        });
        businessCategoriesAdded = await Promise.all(businessCategories);
    }

    await BusinessHours.query().delete().where('businessId', '=', businessId);
    let businessHoursAdded;
    if(hours){
        const businessHours = hours.map(async ({day, openTime, closeTime}) => {
            const openTimeInt = parseInt(openTime.replace(':', ''), 10);
            const closeTimeInt = parseInt(closeTime.replace(':',''), 10);
            await BusinessHours.query().insert({businessId, day, openTime: openTimeInt, closeTime: closeTimeInt});
        });
        businessHoursAdded = await Promise.all(businessHours);
    }

    await BusinessPhoneNumber.query().delete().where('businessId', '=', businessId);
    let businessPhoneNumbersAdded;
    if(phoneNumbers){
        const businessPhoneNumbers = phoneNumbers.map(async (phoneNumber) => {
            await BusinessPhoneNumber.query().insert({businessId, phoneNumber});
        });
        businessPhoneNumbersAdded = await Promise.all(businessPhoneNumbers);
    }

    const { name: nameUpdated, bannerUrl: bannerUrlUpdated, description: descriptionUpdated } = businessUpdated;
    const newUserId = userAdded?.userId;

    console.log({
        businessId, userId, newUserId, nameUpdated, bannerUrlUpdated, descriptionUpdated,
        businessAddress: {businessAddressUpdated},
        categories: {businessCategoriesAdded},
        hours: {businessHoursAdded},
        phoneNumbers: {businessPhoneNumbersAdded}
    });
    return {
        businessId, userId, newUserId, nameUpdated, bannerUrlUpdated, descriptionUpdated,
        businessAddress: {businessAddressUpdated},
        categories: {businessCategoriesAdded},
        hours: {businessHoursAdded},
        phoneNumbers: {businessPhoneNumbersAdded}
    };
};