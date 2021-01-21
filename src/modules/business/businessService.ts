import _ from 'lodash';
import { errors } from '../../utils/constants/errors';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import { AppError } from '../../utils/errors/AppError';
import { Business } from '../../database/models/Business';
import { BusinessAddress } from '../../database/models/BusinessAddress';
import { BusinessCategory } from '../../database/models/BusinessCategory';
import { BusinessHours } from '../../database/models/BusinessHours';
import { BusinessPhoneNumber } from '../../database/models/BusinessPhoneNumber';
import { BusinessImage } from '../../database/models/BusinessImage';
import { UserBusiness } from '../../database/models/UserBusiness';
import { User } from '../../database/models/User';
import { Category } from '../../database/models/Category';
import { raw } from 'objection';
import { BusinessReview } from '../../database/models/BusinessReview';
import { AuthError } from '../../utils/errors/AuthError';
import { Product } from '../../database/models/Product';

/**
 * Verify if the user exist in the database
 * @param userId
 */
const verifyUser = async (userId: string) => {
    if (!await User.query().findById(userId)) {
        throw new AppError(httpCodes.NOT_FOUND, errors.NOT_FOUND, errors.message.USER_NOT_FOUND);
    }
};


export const addNewBusiness = async ({ userId, businessId, name, description, address, bannerUrl, hours, phoneNumbers, categories, images }) => {

    await verifyUser(userId);

    const business = await Business.query().insert({ id: businessId, name, bannerUrl, description });

    await UserBusiness.query().insert({ userId, businessId });

    const { id, cityCode, latitude, longitude } = address
    const businessAddress = await BusinessAddress.query().insert({ id, businessId, address: address.address, cityCode, latitude, longitude });

    const businessCategories = categories.map(async (categoryCode) => {
        const cat = await BusinessCategory.query().insert({ businessId, categoryCode });
        return cat.categoryCode
    });
    const categoriesAdded = await Promise.all(businessCategories);

    const businessHours = hours.map(async ({ day, openTime, closeTime }) => {
        const openTimeInt = parseInt(openTime.replace(':', ''), 10);
        const closeTimeInt = parseInt(closeTime.replace(':', ''), 10);
        const value = await BusinessHours.query().insert({ businessId, day, openTime: openTimeInt, closeTime: closeTimeInt });
        return _.pick(value, ["day", "openTime", "closeTime"])
    });
    const businessHoursAdded = await Promise.all(businessHours);

    let phoneNumbersAdded;
    if (phoneNumbers) {
        const businessPhoneNumber = phoneNumbers.map(async (phoneNumber) => {
            const phone = await BusinessPhoneNumber.query().insert({ businessId, phoneNumber });
            return phone.phoneNumber
        });
        phoneNumbersAdded = await Promise.all(businessPhoneNumber);
    }

    let imagesAdded;
    if (images) {
        const businessImage = images.map(async (image) => {
            const img = await BusinessImage.query().insert({ businessId, imageUrl: image });
            return img.imageUrl
        });
        imagesAdded = await Promise.all(businessImage);
    }
    return {
        ...business,
        address: businessAddress,
        hours: businessHoursAdded,
        phoneNumbers: phoneNumbersAdded,
        categories: categoriesAdded,
        images: imagesAdded
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
 * @param businessId
 */
const verifyBusiness = async (businessId: string) => {
    if (!await Business.query().findById(businessId).where(raw('deletedAt IS NULL'))) {
        throw new AppError(httpCodes.NOT_FOUND, errors.NOT_FOUND, errors.message.BUSINESS_NOT_FOUND);
    }
};

/**
 * Verify if the business address exist in the database and if is relationated with businessId
 * @param businessId
 */
const verifyBusinessAddress = async (addressId: string, businessId: string) => {
    if (!await BusinessAddress.query().findById(addressId)) {
        throw new AppError(httpCodes.NOT_FOUND, errors.NOT_FOUND, errors.message.BUSINESS_NOT_FOUND);
    } else {
        if (!await BusinessAddress.query().findOne({ id: addressId, businessId: businessId })) {
            throw new AppError(httpCodes.BAD_REQUEST, errors.BAD_REQUEST, errors.message.BAD_REQUEST);
        }
    }
};

export const updateBusiness = async ({ userId, businessId, emailNewUser, name, description, bannerUrl, address, hours, phoneNumbers, categories, images }) => {


    await verifyUser(userId);

    await verifyBusiness(businessId);

    await verifyUserHasAccessToBusiness(userId, businessId);

    const { id: addressId, cityCode, latitude, longitude } = address;

    await verifyBusinessAddress(addressId, businessId);
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
            address, cityCode, latitude, longitude
        });
    }

    await BusinessCategory.query().delete().where('businessId', '=', businessId);
    let businessCategoriesAdded
    if (categories) {
        const businessCategories = categories.map(async (categoryCode) => {
            const cat = await BusinessCategory.query().insert({ businessId, categoryCode });
            return cat.categoryCode
        });
        businessCategoriesAdded = await Promise.all(businessCategories);
    }

    await BusinessHours.query().delete().where('businessId', '=', businessId);
    let businessHoursAdded;
    if (hours) {
        const businessHours = hours.map(async ({ day, openTime, closeTime }) => {
            const openTimeInt = parseInt(openTime.replace(':', ''), 10);
            const closeTimeInt = parseInt(closeTime.replace(':', ''), 10);
            const value = await BusinessHours.query().insert({ businessId, day, openTime: openTimeInt, closeTime: closeTimeInt });
            return _.pick(value, ["day", "openTime", "closeTime"]);
        });
        businessHoursAdded = await Promise.all(businessHours);
    }

    await BusinessPhoneNumber.query().delete().where('businessId', '=', businessId);
    let businessPhoneNumbersAdded;
    if (phoneNumbers) {
        const businessPhoneNumbers = phoneNumbers.map(async (phoneNumber) => {
            const phone = await BusinessPhoneNumber.query().insert({ businessId, phoneNumber });
            return phone.phoneNumber
        });
        businessPhoneNumbersAdded = await Promise.all(businessPhoneNumbers);
    }

    await BusinessImage.query().delete().where('businessId', businessId);
    let businessImagesAdded;
    if (images) {
        const businessImages = images.map(async (image) => {
            const img = await BusinessImage.query().insert({ businessId, imageUrl: image });
            return img.imageUrl;
        });
        businessImagesAdded = await Promise.all(businessImages);
    }

    return {
        ..._.pick(businessUpdated, ['id', 'name', 'description', 'bannerUrl']),
        address: businessAddressUpdated,
        hours: businessHoursAdded,
        phoneNumbers: businessPhoneNumbersAdded,
        categories: businessCategoriesAdded,
        images: businessImagesAdded
    };
};

export const deleteBusiness = async (userId, businessId) => {
    await verifyUser(userId);

    await verifyBusiness(businessId);

    await verifyUserHasAccessToBusiness(userId, businessId);

    const businessDeleted = await Business.query().patch({ deletedAt: new Date() }).where('id', businessId);

    const isBusinessDeleted = businessDeleted > 0;

    return isBusinessDeleted;
};

export const businessesByUser = async (userId, reqUserId) => {
    await verifyUser(userId);
    const reqUserType = await User.query().findById(reqUserId);
    if (userId === reqUserId || reqUserType.typeUser === 'admin' || reqUserType.typeUser === 'moderator') {
        const businesses = await UserBusiness.query().where('userId', userId);
        const result = await Promise.all(businesses.map(async ({ businessId }) => {
            return {
                ..._.pick((await Business.query().where({ id: businessId }))?.[0], ['id', 'name', 'description', 'bannerUrl']),
                address: (await BusinessAddress.query().where({ businessId: businessId }))?.[0],
                hours: await BusinessHours.query().where({ businessId: businessId }),
                categories: await BusinessCategory.query().where({ businessId: businessId }),
                phoneNumbers: await BusinessPhoneNumber.query().where({ businessId: businessId }),
                images: await BusinessImage.query().where({ businessId: businessId })
            };
        }));
        return result;
    } else {
        throw new AppError(httpCodes.FORBIDDEN, errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED);
    }
};

export const businessById = async (businessId) => {
    await verifyBusiness(businessId);

    const business = await Business.query().findById(businessId);
    const businessAddress = (await BusinessAddress.query().where({ businessId: businessId }))[0];

    const businessArrays = await Promise.all(
        [await BusinessHours.query().where({ businessId: businessId }),
        await BusinessCategory.query().where({ businessId: businessId }),
        await BusinessPhoneNumber.query().where({ businessId: businessId }),
        await BusinessImage.query().where({ businessId: businessId })
        ]);

    const result = {
        ..._.pick(business, ['id', 'name', 'description', 'bannerUrl']),
        address: businessAddress,
        hours: businessArrays[0],
        categories: businessArrays[1],
        phoneNumbers: businessArrays[2],
        images: businessArrays[3]
    };

    return result;
};

export const getBusinessesBySearch = async (latitude: string, longitude: string, radius: string, pattern: string) => {
    const search = await Business.query().alias('b')
        .select(raw("DISTINCT b.id, b.name, b.description, b.bannerUrl, ba.latitude, ba.longitude, ba.cityCode, ba.id as addressId, ba.address, ba.cityCode"))
        .join(raw('BusinessAddress AS ba ON b.id = ba.businessId'))
        .join(raw('BusinessCategory AS bizcat ON b.id = bizcat.businessId'))
        .join(raw('Category AS c ON bizcat.categoryCode = c.code'))
        .join(raw('Product AS p ON c.code = p.categoryCode'))
        .where(raw('(b.name LIKE "%' + pattern + '%" '
            + 'OR c.category LIKE "%' + pattern + '%" '
            + 'OR p.name LIKE "%' + pattern + '%") '))
        .andWhere(raw('BusinessDistance(' + latitude + ', ' + longitude + ', ba.latitude, ba.longitude) <= ' + radius))
        .orderByRaw('BusinessDistance(' + latitude + ', ' + longitude + ', ba.latitude, ba.longitude) asc');

    const nearbyBusinesses = search.map(business => {
        return {
            id: business.id,
            address: {
                id: business['addressId'],
                address: business['address'],
                latitude: business['latitude'],
                longitude: business['longitude'],
                cityCode: business['cityCode']
            },
            name: business.name,
            description: business.description,
            bannerUrl: business.bannerUrl
        }
    });
    return nearbyBusinesses;
}

export const allCategories = async () => {

    const categories = await Category.query().select();

    return categories;
};

export const reviewBusiness = async ({ businessId, userId, rating, description }: { businessId: string, userId: string, rating: number, description: string }) => {
    // const business = await Business.query().findById(businessId);
    // if(!business) throw new AuthError(errors.NOT_FOUND, errors.message.BUSINESS_NOT_FOUND);

    await verifyBusiness(businessId);

    await BusinessReview.query().insert({ businessId, userId, rating, description });
    const businessReview = await BusinessReview.query().findOne(raw('businessId = "' + businessId + '" and userId = "' + userId + '"'));

    return { review: _.pick(businessReview, ["businessId", "userId", "rating", "description", "createdAt"]) }
}

export const editReviewBusiness = async ({ businessId, userId, rating, description }: { businessId: string, userId: string, rating: number, description: string }) => {
    await verifyBusiness(businessId);

    /*if(businessReview.userId !== reqUserId){
        throw new AppError(httpCodes.UNAUTHORIZED, errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED);
    }*/

    await BusinessReview.query().patch({ description, rating }).findOne({ businessId, userId });
    const businessReviewUpdated = await BusinessReview.query().findOne({ businessId, userId });

    return { review: _.pick(businessReviewUpdated, ["businessId", "userId", "rating", "description", "createdAt"]) };
};

export const deleteReviewBusiness = async (businessId: string, userId: string, sessionId: string) => {
    await verifyBusiness(businessId);
    const user = await User.query().findById(userId);
    if (!user) throw new AuthError(errors.NOT_FOUND, errors.message.USER_NOT_FOUND);
    const sessionUser = await User.query().findById(sessionId);
    const businessReview = await BusinessReview.query().findOne({ businessId, userId });
    if (!businessReview) throw new AuthError(errors.NOT_FOUND, errors.message.BUSINESS_REVIEW_NOT_FOUND)
    if (sessionId != userId) {
        switch (sessionUser.typeUser) {
            case 'admin':
                if (user.typeUser == 'admin') throw new AuthError(errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED);
                break;
            case 'moderator':
                if (user.typeUser != 'normal') throw new AuthError(errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED);
                break;
            default:
                throw new AuthError(errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED);
        }
    }

    const deleted = await BusinessReview.query().delete().where({ businessId, userId });
    return deleted != 0;
};

export const addCategory = async (category: string) => {
    const categoryExists = await Category.query().findOne("category", category);
    if (categoryExists) throw new AppError(httpCodes.CONFLICT, errors.CATEGORY, errors.message.CATEGORY_FOUND);
    const categoryInserted = await Category.query().insert({ category });
    return { categoryInserted: _.pick(categoryInserted, ["category"]) }
};

export const deleteCategory = async (code) => {
    const category = await Category.query().findById(code);
    if (!category) throw new AppError(httpCodes.NOT_FOUND, errors.NOT_FOUND, errors.message.CATEGORY_NOT_FOUND);

    const categoryDeleted = await Category.query().delete().where("code", code);
    const isCategoryDeleted = categoryDeleted > 0;

    return isCategoryDeleted;
};

export const getBusinessByCategory = async (category: string, latitude: number, longitude: number, radius: number) => {

    const businesses = await Business.query()
        .select(raw("Business.id, Business.name, Business.description, Business.bannerUrl, BusinessAddress.id as addressId, BusinessAddress.address, BusinessAddress.latitude, BusinessAddress.longitude, BusinessAddress.cityCode"))
        .join(raw("BusinessAddress ON Business.id = BusinessAddress.businessId"))
        .join(raw("BusinessCategory ON Business.id = BusinessCategory.businessId"))
        .join(raw("Category ON BusinessCategory.categoryCode = Category.code"))
        .where(raw('Category.category LIKE "%' + category + '%" '))
        .andWhere(raw('BusinessDistance(' + latitude + ', ' + longitude + ', BusinessAddress.latitude, BusinessAddress.longitude) <= ' + radius))
        .orderByRaw('BusinessDistance(' + latitude + ', ' + longitude + ', BusinessAddress.latitude, BusinessAddress.longitude) ASC');

    const searchResult = businesses.map(business => {
        return {
            id: business.id,
            name: business.name,
            description: business.description,
            bannerUrl: business.bannerUrl,
            address: {
                id: business['addressId'],
                address: business['address'],
                latitude: business['latitude'],
                longitude: business['longitude'],
                cityCode: business['cityCode']
            }
        }
    });

    return searchResult;
};