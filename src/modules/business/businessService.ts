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
import { Session } from '../../database/models/Session';


export const addNewBusiness = async (business) => {
<<<<<<< HEAD
    const { userId, businessId, addressId, name, description, address, latitude, longitude, cityCode, stateCode, countryCode, bannerUrl, hours, phoneNumbers, categories } = business;
=======
    const {userId, businessId, addressId, name, description, address, latitude, longitude, cityCode, stateCode, countryCode, bannerUrl, hours, phoneNumbers, categories} = business;
>>>>>>> features/business/edit-business

    const user = await User.query().findOne('id', userId);
    if (!user) throw new AppError(httpCodes.NOT_FOUND, errors.NOT_FOUND, errors.message.USER_NOT_FOUND);

<<<<<<< HEAD
    await Business.query().insert({ id: businessId, name, bannerUrl, description });

    await UserBusiness.query().insert({ userId, businessId });

    await BusinessAddress.query().insert({ id: addressId, businessId, address, cityCode, stateCode, countryCode, latitude, longitude });

=======
    await Business.query().insert({id: businessId, name, bannerUrl, description});

    await UserBusiness.query().insert({userId, businessId});

    await BusinessAddress.query().insert({id: addressId, businessId, address, cityCode, stateCode, countryCode, latitude, longitude});
    
>>>>>>> features/business/edit-business
    const businessCategory = categories.map(async (categoryCode) => {
        await BusinessCategory.query().insert({ businessId, categoryCode });
    });

<<<<<<< HEAD
    const businessHours = hours.map(async ({ day, openTime, closeTime }) => {
=======
    const businessHours = hours.map(async ({day, openTime, closeTime}) => {
>>>>>>> features/business/edit-business
        const openTimeInt = parseInt(openTime.replace(':', ''), 10);
        const closeTimeInt = parseInt(closeTime.replace(':', ''), 10);
        await BusinessHours.query().insert({ businessId, day, openTime: openTimeInt, closeTime: closeTimeInt });
    });

<<<<<<< HEAD
    if (phoneNumbers) {
=======
    if(phoneNumbers){
>>>>>>> features/business/edit-business
        const businessPhoneNumber = phoneNumbers.map(async (phoneNumber) => {
            await BusinessPhoneNumber.query().insert({ businessId, phoneNumber });
        });
        await Promise.all(businessPhoneNumber);
    }

    await Promise.all(businessCategory);
    await Promise.all(businessHours);

<<<<<<< HEAD
    return { userId, businessId, addressId, name, description, address, latitude, longitude, cityCode, stateCode, countryCode, bannerUrl, hours, phoneNumbers, categories };
=======
    return {userId, businessId, addressId, name, description, address, latitude, longitude, cityCode, stateCode, countryCode, bannerUrl, hours, phoneNumbers, categories};
>>>>>>> features/business/edit-business
};

/**
 * Verify the user has admin access to the business he's creating/editing the account for
 * @param userId
 * @param businessId
 */
const verifyUserHasAccessToBusiness = async (userId: string, businessId: string) => {
<<<<<<< HEAD
    const userBusiness = await UserBusiness.query().findOne({ where: { userId, businessId } });
=======
    const userBusiness = (await UserBusiness.query().where('userId', userId).andWhere('businessId', businessId))[0];
>>>>>>> features/business/edit-business
    if (!userBusiness) {
        throw new AppError(httpCodes.FORBIDDEN, 'No permission error', 'You do not have admin permission for the given business');
    }
};

export const updateBusiness = async (business, userId, businessId) => {
<<<<<<< HEAD
    const { addressId, emailNewUser, name, description, address, latitude, longitude, cityCode, stateCode, countryCode, bannerUrl, hours, phoneNumbers, categories } = business;

    if (!await Business.query().findById(businessId)) throw new AppError(httpCodes.NOT_FOUND, errors.NOT_FOUND, errors.message.BUSINESS_NOT_FOUND);

<<<<<<< HEAD
    if (!await User.query().findOne('id', userId)) throw new AppError(httpCodes.NOT_FOUND, errors.NOT_FOUND, errors.message.USER_NOT_FOUND);
=======
    if (!await User.query().findById(userId)) throw new AppError(httpCodes.NOT_FOUND, errors.NOT_FOUND, errors.message.USER_NOT_FOUND);
>>>>>>> 6179d0de84c686e5e26489e52e80200b4935299e
=======
    const {addressId, emailNewUser, name, description, address, latitude, longitude, cityCode, stateCode, countryCode, bannerUrl, hours, phoneNumbers, categories} = business;

    if(!await Business.query().findOne('id', businessId)) throw new AppError(httpCodes.NOT_FOUND, errors.NOT_FOUND, errors.message.BUSINESS_NOT_FOUND);

    if(!await User.query().findOne('id', userId)) throw new AppError(httpCodes.NOT_FOUND, errors.NOT_FOUND, errors.message.USER_NOT_FOUND);

    // if(!await Session.query().findOne({where: {token: sessionToken, userId}})) throw new AppError(httpCodes.UNAUTHORIZED, errors.CREDENTIAL, errors.message.SESSION_NOT_FOUND);
>>>>>>> features/business/edit-business

    verifyUserHasAccessToBusiness(userId, businessId);

    const businessUpdated = await Business.query().patchAndFetchById(businessId, {
        name, bannerUrl, description
    });

    let userAdded;
<<<<<<< HEAD
    const userByEmail = await User.query().findOne('email', emailNewUser);
    if (!userByEmail) throw new AppError(httpCodes.NOT_FOUND, errors.USER_NOT_FOUND_ERROR, errors.message.USER_NOT_FOUND);
    else {
        userAdded = await UserBusiness.query().insert({ userId: userByEmail.id, businessId });
    }

    const businessAddressUpdated = await BusinessAddress.query().patchAndFetchById(addressId, {
        address, cityCode, stateCode, countryCode, latitude, longitude
    });

    let businessCategoriesAdded
    await BusinessCategory.query().delete().whereColumn('businessId', businessId);◘
    if (categories) {
        const businessCategories = categories.map(async (categoryCode) => {
            await BusinessCategory.query().insert({ businessId, categoryCode });
=======
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
>>>>>>> features/business/edit-business
        });
        businessCategoriesAdded = await Promise.all(businessCategories);
    }

<<<<<<< HEAD
    let businessHoursAdded;
    await BusinessHours.query().delete().whereColumn('businessId', businessId);
    if (hours) {
        const businessHours = hours.map(async ({ day, openTime, closeTime }) => {
            const openTimeInt = parseInt(openTime.replace(':', ''), 10);
            const closeTimeInt = parseInt(closeTime.replace(':', ''), 10);
            await BusinessHours.query().insert({ businessId, day, openTime: openTimeInt, closeTime: closeTimeInt });
=======
    await BusinessHours.query().delete().where('businessId', '=', businessId);
    let businessHoursAdded;
    if(hours){
        const businessHours = hours.map(async ({day, openTime, closeTime}) => {
            const openTimeInt = parseInt(openTime.replace(':', ''), 10);
            const closeTimeInt = parseInt(closeTime.replace(':',''), 10);
            await BusinessHours.query().insert({businessId, day, openTime: openTimeInt, closeTime: closeTimeInt});
>>>>>>> features/business/edit-business
        });
        businessHoursAdded = await Promise.all(businessHours);
    }

<<<<<<< HEAD
    let businessPhoneNumbersAdded;
    await BusinessPhoneNumber.query().delete().whereColumn('businessId', businessId);
    if (phoneNumbers) {
        const businessPhoneNumbers = phoneNumbers.map(async (phoneNumber) => {
            await BusinessPhoneNumber.query().insert({ businessId, phoneNumber });
=======
    await BusinessPhoneNumber.query().delete().where('businessId', '=', businessId);
    let businessPhoneNumbersAdded;
    if(phoneNumbers){
        const businessPhoneNumbers = phoneNumbers.map(async (phoneNumber) => {
            await BusinessPhoneNumber.query().insert({businessId, phoneNumber});
>>>>>>> features/business/edit-business
        });
        businessPhoneNumbersAdded = await Promise.all(businessPhoneNumbers);
    }

    const { name: nameUpdated, bannerUrl: bannerUrlUpdated, description: descriptionUpdated } = businessUpdated;
    const newUserId = userAdded?.userId;

<<<<<<< HEAD
    return {
        businessId, userId, newUserId, nameUpdated, bannerUrlUpdated, descriptionUpdated,
        address: businessAddressUpdated,
        categories: businessCategoriesAdded,
        hours: businessHoursAdded,
        phoneNumbers: businessPhoneNumbersAdded
=======
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
>>>>>>> features/business/edit-business
    };
};