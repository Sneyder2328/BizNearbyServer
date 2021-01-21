import { User } from '../database/models/User';
import { Business } from '../database/models/Business';
import { BusinessAddress } from '../database/models/BusinessAddress';
import { BusinessCategory } from '../database/models/BusinessCategory';
import { BusinessHours } from '../database/models/BusinessHours';
import { BusinessImage } from '../database/models/BusinessImage';
import { BusinessPhoneNumber } from '../database/models/BusinessPhoneNumber';
import { BusinessReview } from '../database/models/BusinessReview';
import { UserBusiness } from '../database/models/UserBusiness';
import { Session } from '../database/models/Session';
import { Report } from '../database/models/Report';
import { ReportReview } from '../database/models/ReportReview';
import { genText } from './seed';
import { Category } from '../database/models/Category';
import { City } from '../database/models/City';
import { State } from '../database/models/State';
import { Country } from '../database/models/Country';
import { Product } from '../database/models/Product';

export async function wipeOutDatabase() {
    await User.query().delete();
    await Business.query().delete();
    await UserBusiness.query().delete();
    await BusinessAddress.query().delete();
    await BusinessCategory.query().delete();
    await BusinessHours.query().delete();
    await BusinessImage.query().delete();
    await BusinessPhoneNumber.query().delete();
    await Report.query().delete();
    await BusinessReview.query().delete();
    await Product.query().delete();
    await Category.query().delete();
    await City.query().delete();
    await State.query().delete();
    await Country.query().delete();
}

export async function wipeOutUser(id: string) {
    await User.query().delete().where({ id });
}

export async function wipeOutUsers(ids) {
    await User.query().delete().findByIds(ids);
}

export async function wipeOutBusiness() {
    await Business.query().delete();
}

export async function wipeOutReports() {
    await Report.query().delete();
}

export async function wipeOutBusinessReview() {
    await BusinessReview.query().delete();
}

export async function createCategory({ code, category }: { code: number, category: string }) {
    await Category.query().insert({ code, category });
}

export async function createUser({ id, fullname, email, password, typeLogin, typeUser }: { id: string; fullname: string; email: string; password: string | null; typeLogin: "email" | "facebook" | "google"; typeUser: "moderator" | "normal" | "admin"; }) {
    //delete user?.googleAuth;
    // delete user?.facebookAuth;

    await User.query().insert({ id, fullname, email, password, typeLogin, typeUser });
}

export async function modifyUserType(id: string, typeUser: "normal" | "admin" | "moderator") {
    await User.query().update({ typeUser }).where({ id });
}

export async function createProduct({ categoryCode, name }: { categoryCode: number, name: string }) {
    await Product.query().insert({ categoryCode, name });
}

export async function createBusiness({ id, name, description, bannerUrl }: { id: string; name: string; description: string; bannerUrl: string; }) {
    await Business.query().insert({ id, name, description, bannerUrl });
}

export async function createSession({ token, userId }: { token: string; userId: string }) {
    await Session.query().insert({ token, userId });
}

export async function createCity({ code, name, stateCode }: { code: number; name: string; stateCode: number }) {
    await City.query().insert({ code, name, stateCode });
}

export async function createState({ code, name, countryCode }: { code: number; name: string; countryCode: number }) {
    await State.query().insert({ code, name, countryCode });
}

export async function createCountry({ code, name }: { code: number; name: string }) {
    await Country.query().insert({ code, name });
}

export async function createUserBusiness({ userId, businessId }: { userId: string; businessId: string }) {
    await UserBusiness.query().insert({ userId, businessId });
}

export async function createBusinessAddress({ id, businessId, address, cityCode, latitude, longitude }: { id: string; businessId: string; address: string; cityCode: number; latitude: number; longitude: number; }) {
    await BusinessAddress.query().insert({ id, businessId, cityCode, latitude, longitude });
}

export async function createBusinessCategory({ businessId, categoryCode }: { businessId: string; categoryCode: number }) {
    await BusinessCategory.query().insert({ businessId, categoryCode });
}

export async function createBusinessHours(businessId: string, businessHours) {
    const hours = businessHours.map(async ({ day, openTime, closeTime }) => {
        await BusinessHours.query().insert({ businessId, day, openTime, closeTime });
    });
}

export async function createBusinessPhoneNumber({ businessId, phoneNumber }: { businessId: string; phoneNumber: string }) {
    await BusinessPhoneNumber.query().insert({ businessId, phoneNumber });
}

export async function createReport({ id, businessId, userId, title, description }: { id: string; businessId: string; userId: string; title: string | null; description: string | null; }) {
    await Report.query().insert({ id, businessId, userId, title, description });
}

export async function createReviewedReport({ id, businessId, userId, title, description }: { id: string; businessId: string; userId: string; title: string | null; description: string | null; }) {
    await Report.query().insert({ id, businessId, userId, title, description, reviewedAt: new Date() });
}

export async function createReportReview({ reportId, userId, analysis }: { reportId: string, userId: string, analysis: string | null }) {
    await ReportReview.query().insert({ userId, reportId, analysis });
}

export async function createBusinessImage({ businessId, imageUrl }: { businessId: string; imageUrl: string }) {
    await BusinessImage.query().insert({ businessId, imageUrl });
}

export async function createBusinessReview({ businessId, userId, rating, description }: { businessId: string; userId: string; rating: number; description: string; }) {
    await BusinessReview.query().insert({ businessId, userId, rating, description });
}

export async function insertBusinessData() {
    await createUser({ id: 'ebf9b67a-50a4-439b-9af6-25dd7ff4810f', fullname: 'Kevin Cheng', email: 'kevin@gmail.com', password: '12345678', typeLogin: 'email', typeUser: 'normal' });
    await createUser({ id: 'f94bcebf-f181-447b-b85f-3c5f36c2a269', fullname: 'Andres Alvarez', email: 'andres@gmail.com', password: '12345678', typeLogin: 'email', typeUser: 'normal' });
    await createSession({ token: 'fcd84d1f-ee1b-4636-9f61-78dc349f23e5', userId: 'ebf9b67a-50a4-439b-9af6-25dd7ff4810f' });
    await createSession({ token: 'b337e27e-bcf0-4154-8a77-96daa873c9e5', userId: 'f94bcebf-f181-447b-b85f-3c5f36c2a269' });
    await createBusiness({ id: "a8bcd05e-4606-4a55-a5dd-002f8516493e", name: "Bodega Mi encanto", description: "My business it's so nice", bannerUrl: "AnURL" });
    await createUserBusiness({ userId: 'ebf9b67a-50a4-439b-9af6-25dd7ff4810f', businessId: "a8bcd05e-4606-4a55-a5dd-002f8516493e" });
    await createBusinessAddress({ id: "eee15b20-917f-4d69-a055-e306d938d196", businessId: "a8bcd05e-4606-4a55-a5dd-002f8516493e", address: "Calle 50 entre carreras 14 y 15", cityCode: 1, latitude: 10.059972, longitude: -69.340570 });
    await createBusinessCategory({ businessId: "a8bcd05e-4606-4a55-a5dd-002f8516493e", categoryCode: 1 });
    await createBusinessHours("a8bcd05e-4606-4a55-a5dd-002f8516493e", [{
        day: 1,
        openTime: 600,
        closeTime: 1200
    },
    {
        day: 1,
        openTime: 1300,
        closeTime: 1830
    }]);
    await createBusinessPhoneNumber({ businessId: "a8bcd05e-4606-4a55-a5dd-002f8516493e", phoneNumber: "04125568177" })
    await createBusinessImage({ businessId: "a8bcd05e-4606-4a55-a5dd-002f8516493e", imageUrl: "UrlForExample" })
}

export async function setupBusiness(userId: string, businessId: string, businessAddressId: string) {
    await createBusiness({ id: businessId, name: "Bodega Mi encanto", description: "My business is pretty chill and calm", bannerUrl: "AnURL" });
    await createUserBusiness({ userId, businessId });
    await createBusinessAddress({ id: businessAddressId, businessId, address: "Calle 50 entre carreras 14 y 15", cityCode: 1, latitude: 10.059972, longitude: -69.340570 });
    await createBusinessCategory({ businessId, categoryCode: 1 });
    await createBusinessHours(businessId, [{
        day: 1,
        openTime: 600,
        closeTime: 1200
    },
    {
        day: 1,
        openTime: 1300,
        closeTime: 1830
    }]);
    await createBusinessPhoneNumber({ businessId, phoneNumber: "04125568177" })
    await createBusinessImage({ businessId, imageUrl: "UrlForExample" })

}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

export async function createNearbyBusiness(userId: string, businessId: string, businessAddressId: string, categoryCode: number, latitude: number, longitude: number, bizName: string) {
    await createBusiness({ id: businessId, name: bizName, description: 'THIS IS A GOOD PLACE', bannerUrl: "AnURL" });
    await createUserBusiness({ userId, businessId });
    await createBusinessAddress({ id: businessAddressId, businessId, address: "Calle 50 entre carreras 14 y 15", cityCode: 1, latitude: getRandomArbitrary(latitude + 0.1000, latitude + 0.1008), longitude: getRandomArbitrary(longitude + 0.1000, longitude + 0.1008) });
    await createBusinessCategory({ businessId, categoryCode });
    await createBusinessHours(businessId, [{
        day: 1,
        openTime: 600,
        closeTime: 1200
    },
    {
        day: 1,
        openTime: 1300,
        closeTime: 1830
    }]);
    await createBusinessPhoneNumber({ businessId, phoneNumber: "04125568177" })
    await createBusinessImage({ businessId, imageUrl: "UrlForExample" })
}

export async function setupFixedTable() {
    await createCountry({ code: 1, name: "Venezuela" });
    await createState({ code: 1, countryCode: 1, name: "Lara" });
    await createCity({ code: 1, stateCode: 1, name: "Barquisimeto" });
    await createCity({ code: 2, stateCode: 1, name: "El Tocuyo" });
    await createCategory({ code: 1, category: "Restaurant" });
    await createCategory({ code: 2, category: "Comet" });
    await createCategory({ code: 3, category: "Market" });
    await createProduct({ categoryCode: 1, name: "Pollo" });
    await createProduct({ categoryCode: 2, name: "Book" });
    await createProduct({ categoryCode: 3, name: "Veggies" });
}