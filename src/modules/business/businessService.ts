import { errors } from '../../utils/constants/errors';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import { AppError } from '../../utils/errors/AppError';
import { Business } from '../../database/models/Business';
import { BusinessAddress } from '../../database/models/BusinessAddress';
import { BusinessCategory } from '../../database/models/BusinessCategory';
import { BusinessHours } from '../../database/models/BusinessHours';
import { BusinessPhoneNumber } from '../../database/models/BusinessPhoneNumber';
import { UserBusiness } from '../../database/models/UserBusiness';
import { User } from '../../database/models/User';

/**
 * Verify if the user exist in the database
 * @param userId
 */
const verifyUser = async (userId: string) => {
    if (!await User.query().findById(userId)){
        throw new AppError(httpCodes.NOT_FOUND, errors.NOT_FOUND, errors.message.USER_NOT_FOUND);
    } 
};


export const addNewBusiness = async ({ userId, businessId, addressId, name, description, address, latitude, longitude, cityCode, stateCode, countryCode, bannerUrl, hours, phoneNumbers, categories }) => {

    verifyUser(userId);

    const business = await Business.query().insert({ id: businessId, name, bannerUrl, description });

    await UserBusiness.query().insert({ userId, businessId });

    const businessAddress = await BusinessAddress.query().insert({ id: addressId, businessId, address, cityCode, stateCode, countryCode, latitude, longitude });

    const businessCategories = categories.map(async (categoryCode) => {
        return await BusinessCategory.query().insert({ businessId, categoryCode });
    });
    const categoriesAdded = await Promise.all(businessCategories);

    const businessHours = hours.map(async ({ day, openTime, closeTime }) => {
        const openTimeInt = parseInt(openTime.replace(':', ''), 10);
        const closeTimeInt = parseInt(closeTime.replace(':', ''), 10);
        return await BusinessHours.query().insert({ businessId, day, openTime: openTimeInt, closeTime: closeTimeInt });
    });
    const businessHoursAdded = await Promise.all(businessHours);

    let phoneNumbersAdded
    if (phoneNumbers) {
        const businessPhoneNumber = phoneNumbers.map(async (phoneNumber) => {
            return await BusinessPhoneNumber.query().insert({ businessId, phoneNumber });
        });
        phoneNumbersAdded = await Promise.all(businessPhoneNumber);
    }



    return {
        ...business,
        businessAddress,
        hours: businessHoursAdded,
        phoneNumbers: phoneNumbersAdded,
        categories: categoriesAdded
    };
};

/**
 * Verify the user has admin access to the business he's creating/editing the account for
 * @param userId
 * @param businessId
 */
const verifyUserHasAccessToBusiness = async (userId: string, businessId: string) => {
    const userBusiness = (await UserBusiness.query().where('userId', userId).andWhere('businessId', businessId))[0];
    if (!userBusiness) {
        throw new AppError(httpCodes.UNAUTHORIZED, 'No permission error', 'You do not have admin permission for the given business');
    }
};

/**
 * Verify if the business exist in the database
 * @param businessIdId
 */
const verifyBusiness = async (businessId: string) => {
    if (!await Business.query().findById(businessId)){
        throw new AppError(httpCodes.NOT_FOUND, errors.NOT_FOUND, errors.message.BUSINESS_NOT_FOUND);
    } 
};

export const updateBusiness = async ({userId, businessId, addressId, emailNewUser, name, description, address, latitude, longitude, cityCode, stateCode, countryCode, bannerUrl, hours, phoneNumbers, categories }) => {

    verifyUser(userId);

    verifyBusiness(businessId);

    verifyUserHasAccessToBusiness(userId, businessId);

    const businessUpdated = await Business.query().patchAndFetchById(businessId, {
        name, bannerUrl, description
    });

    let userAdded;
    if (emailNewUser) {
        const userByEmail = await User.query().findOne('email', emailNewUser);
        if (!userByEmail) throw new AppError(httpCodes.NOT_FOUND, errors.USER_NOT_FOUND_ERROR, errors.message.USER_NOT_FOUND);
        else {
            userAdded = await UserBusiness.query().insert({ userId: userByEmail.id, businessId });
        }
    }

    const businessAddress = await BusinessAddress.query().findById(addressId);
    let businessAddressUpdated;
    if (businessAddress?.id === addressId) {
        businessAddressUpdated = await BusinessAddress.query().patchAndFetchById(addressId, {
            address, cityCode, stateCode, countryCode, latitude, longitude
        });
    }

    await BusinessCategory.query().delete().where('businessId', '=', businessId);
    let businessCategoriesAdded
    if (categories) {
        const businessCategories = categories.map(async (categoryCode) => {
            return await BusinessCategory.query().insert({ businessId, categoryCode });
        });
        businessCategoriesAdded = await Promise.all(businessCategories);
    }

    await BusinessHours.query().delete().where('businessId', '=', businessId);
    let businessHoursAdded;
    if (hours) {
        const businessHours = hours.map(async ({ day, openTime, closeTime }) => {
            const openTimeInt = parseInt(openTime.replace(':', ''), 10);
            const closeTimeInt = parseInt(closeTime.replace(':', ''), 10);
            return await BusinessHours.query().insert({ businessId, day, openTime: openTimeInt, closeTime: closeTimeInt });
        });
        businessHoursAdded = await Promise.all(businessHours);
    }

    await BusinessPhoneNumber.query().delete().where('businessId', '=', businessId);
    let businessPhoneNumbersAdded;
    if (phoneNumbers) {
        const businessPhoneNumbers = phoneNumbers.map(async (phoneNumber) => {
            return await BusinessPhoneNumber.query().insert({ businessId, phoneNumber });
        });
        businessPhoneNumbersAdded = await Promise.all(businessPhoneNumbers);
    }

    return {
        ...businessUpdated,
        businessAddress: businessAddressUpdated,
        categories: businessCategoriesAdded,
        hours: businessHoursAdded,
        phoneNumbers: businessPhoneNumbersAdded
    };
};

export const deleteBusiness = async (userId, businessId) => {
    verifyUser(userId);

    verifyBusiness(businessId);

    verifyUserHasAccessToBusiness(userId, businessId);

    const businessDeleted = await Business.query().patch({deletedAt: new Date()}).where('id', businessId);

    const isBusinessDeleted = businessDeleted > 0;

    return isBusinessDeleted;
};