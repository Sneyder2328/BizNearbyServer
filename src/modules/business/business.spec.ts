import request from "supertest";
import { app, server } from '../../index';
import { wipeOutDatabase, insertBusinessData, createUser, createSession, createBusinessReview } from '../../test/setup';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import { admin, businesses, genText, moderator, updateBusiness, users, businessReview } from '../../test/seed';
import knex from "../../database/knex";
import { genUUID } from "../../utils/utils";
import { endpoints } from '../../utils/constants/endpoints';
import { errors } from "../../utils/constants/errors";
import config from "../../config/config";


const token = "Bearer fcd84d1f-ee1b-4636-9f61-78dc349f23e5";
const normalToken = "Bearer " + genUUID();
const adminToken = "Bearer " + genUUID();
const moderatorToken = "Bearer " + genUUID();
const businessId = "a8bcd05e-4606-4a55-a5dd-002f8516493e"
const userId = 'ebf9b67a-50a4-439b-9af6-25dd7ff4810f';

describe('POST' + endpoints.users.owner.BUSINESS_REGISTER, () => {
    const business = nro =>  {
        return {
            id: businesses[nro].businessId,
            name: businesses[nro].name,
            description: businesses[nro].description,
            bannerUrl: businesses[nro].bannerUrl,
            businessAddress: {
                id: businesses[nro].addressId,
                businessId: businesses[nro].businessId,
                address: businesses[nro].address,
                latitude: businesses[nro].latitude,
                longitude: businesses[nro].longitude,
                cityCode: businesses[nro].cityCode,
            },
            hours: businesses[nro].hours.map(hours => {
                return {
                    businessId: businesses[nro].businessId,
                    day: hours.day,
                    openTime: parseInt(hours.openTime.replace(':', ''), 10),
                    closeTime: parseInt(hours.closeTime.replace(':', ''), 10)
                }
            }),
            phoneNumbers: businesses[nro].phoneNumbers.map(phoneNumber => {
                return {
                    businessId: businesses[nro].businessId,
                    phoneNumber: phoneNumber
                }
            }),
            categories: businesses[nro].categories.map(category => {
                return {
                    businessId: businesses[nro].businessId,
                    categoryCode: category
                }
            }),
            images : businesses[nro].images?.map(image => {
                return {
                    businessId: businesses[nro].businessId,
                    imageUrl: image
                }
            })
        }
    };
    beforeEach(async () => {
        await wipeOutDatabase();
        await createUser({id: 'ebf9b67a-50a4-439b-9af6-25dd7ff4810f', fullname: 'Kevin Cheng', email: 'kevin@gmail.com', password: '12345678', typeLogin: 'email', typeUser: 'normal'});
        await createSession({token: 'fcd84d1f-ee1b-4636-9f61-78dc349f23e5', userId: 'ebf9b67a-50a4-439b-9af6-25dd7ff4810f'});
    });

    it('should create new business', (done) => {
        request(app)
            .post(endpoints.users.owner.BUSINESS_REGISTER)
            .set('authorization', token)
            .send(businesses[0])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toEqual({...business(0)});
            })
            .end(done);
    });

    it('should create a new business without cityCode', (done) => {
        request(app)
            .post(endpoints.users.owner.BUSINESS_REGISTER)
            .set('authorization', token)
            .send(businesses[1])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toEqual({...business(1)});
            })
            .end(done);
    });

    it('should create a new business without phone numbers', (done) => {
        request(app)
            .post(endpoints.users.owner.BUSINESS_REGISTER)
            .set('authorization', token)
            .send(businesses[2])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toEqual({...business(2)});
            })
            .end(done);
    });

    it('should not create a new business without latitude and longitude', (done) => {
        request(app)
            .post(endpoints.users.owner.BUSINESS_REGISTER)
            .set('authorization', token)
            .send(businesses[3])
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new business if the user not exists', (done) => {
        request(app)
            .post(endpoints.users.owner.BUSINESS_REGISTER)
            .set('authorization', 'Bearer ebf9b67a-50a4-439b-9af6-25dd7ff4810f')
            .send(businesses[4])
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new business with a long name', (done) => {
        request(app)
            .post(endpoints.users.owner.BUSINESS_REGISTER)
            .set('authorization', token)
            .send(businesses[5])
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new business without businessId', (done) => {
        request(app)
            .post(endpoints.users.owner.BUSINESS_REGISTER)
            .set('authorization', token)
            .send(businesses[6])
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new business without addressId', (done) => {
        request(app)
            .post(endpoints.users.owner.BUSINESS_REGISTER)
            .set('authorization', token)
            .send(businesses[7])
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new business without name', (done) => {
        request(app)
            .post(endpoints.users.owner.BUSINESS_REGISTER)
            .set('authorization', token)
            .send(businesses[8])
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new business without latitute and longitude', (done) => {
        request(app)
            .post(endpoints.users.owner.BUSINESS_REGISTER)
            .set('authorization', token)
            .send(businesses[9])
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new business without hours', (done) => {
        request(app)
            .post(endpoints.users.owner.BUSINESS_REGISTER)
            .set('authorization', token)
            .send(businesses[10])
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });

    it('should not create a new business without categories', (done) => {
        request(app)
            .post(endpoints.users.owner.BUSINESS_REGISTER)
            .set('authorization', token)
            .send(businesses[11])
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body['errors']);
            })
            .end(done);
    });
});

describe('PUT' + endpoints.users.owner.BUSINESS_UPDATE, () => {
    const business = (nro, businessId) =>  {
        return {
            id: businessId,
            name: updateBusiness[nro].name,
            description: updateBusiness[nro].description,
            bannerUrl: updateBusiness[nro].bannerUrl,
            businessAddress: {
                id: updateBusiness[nro].addressId,
                businessId: businessId,
                address: updateBusiness[nro].address,
                latitude: updateBusiness[nro].latitude,
                longitude: updateBusiness[nro].longitude,
                cityCode: updateBusiness[nro].cityCode,
            },
            hours: updateBusiness[nro].hours.map(hours => {
                return {
                    businessId: businessId,
                    day: hours.day,
                    openTime: parseInt(hours.openTime.replace(':', ''), 10),
                    closeTime: parseInt(hours.closeTime.replace(':', ''), 10)
                }
            }),
            phoneNumbers: updateBusiness[nro].phoneNumbers.map(phoneNumber => {
                return {
                    businessId: businessId,
                    phoneNumber: phoneNumber
                }
            }),
            categories: updateBusiness[nro].categories.map(category => {
                return {
                    businessId: businessId,
                    categoryCode: category
                }
            }),
            images : updateBusiness[nro].images?.map(image => {
                return {
                    businessId: businessId,
                    imageUrl: image
                }
            })
        }
    };
    beforeEach(async () => {
        await wipeOutDatabase();
        await insertBusinessData();
    });

    it('should update business name', (done) => {
        request(app)
            .put(endpoints.users.owner.BUSINESS_UPDATE.replace(':businessId', businessId))
            .set('authorization', token)
            .send(updateBusiness[0])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toEqual({...business(0, businessId)})
            })
            .end(done);
    });

    it('should update business description', (done) => {
        request(app)
            .put(endpoints.users.owner.BUSINESS_UPDATE.replace(':businessId', businessId))
            .set('authorization', token)
            .send(updateBusiness[1])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toEqual({...business(1, businessId)})
            })
            .end(done);
    });

    it('should update business address', (done) => {
        request(app)
            .put(endpoints.users.owner.BUSINESS_UPDATE.replace(':businessId', businessId))
            .set('authorization', token)
            .send(updateBusiness[2])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toEqual({...business(2, businessId)})
            })
            .end(done);
    });

    it('should update business latitude and longitude', (done) => {
        request(app)
            .put(endpoints.users.owner.BUSINESS_UPDATE.replace(':businessId', businessId))
            .set('authorization', token)
            .send(updateBusiness[3])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toEqual({...business(3, businessId)})
            })
            .end(done);
    });

    it('should update business cityCode, stateCode and countryCode', (done) => {
        request(app)
            .put(endpoints.users.owner.BUSINESS_UPDATE.replace(':businessId', businessId))
            .set('authorization', token)
            .send(updateBusiness[4])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toEqual({...business(4, businessId)})
            })
            .end(done);
    });

    it('should update business bannerUrl', (done) => {
        request(app)
            .put(endpoints.users.owner.BUSINESS_UPDATE.replace(':businessId', businessId))
            .set('authorization', token)
            .send(updateBusiness[5])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toEqual({...business(5, businessId)})
            })
            .end(done);
    });

    it('should update business hours', (done) => {
        request(app)
            .put(endpoints.users.owner.BUSINESS_UPDATE.replace(':businessId', businessId))
            .set('authorization', token)
            .send(updateBusiness[6])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toEqual({...business(6, businessId)})
            })
            .end(done);
    });

    it('should update business phone number', (done) => {
        request(app)
            .put(endpoints.users.owner.BUSINESS_UPDATE.replace(':businessId', businessId))
            .set('authorization', token)
            .send(updateBusiness[7])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toEqual({...business(7, businessId)})
            })
            .end(done);
    });

    it('should update business category', (done) => {
        request(app)
            .put(endpoints.users.owner.BUSINESS_UPDATE.replace(':businessId', businessId))
            .set('authorization', token)
            .send(updateBusiness[8])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toEqual({...business(8, businessId)})
            })
            .end(done);
    });

    it('should add new user to userBusiness', (done) => {
        request(app)
            .put(endpoints.users.owner.BUSINESS_UPDATE.replace(':businessId', businessId))
            .set('authorization', token)
            .send(updateBusiness[9])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toEqual({...business(9, businessId)})
            })
            .end(done);
    });

    it('should not update with a wrong businessId', (done) => {
        request(app)
            .put(endpoints.users.owner.BUSINESS_UPDATE.replace(':businessId', '8d4b7b25-e249-4550-af02-c43be3054d4f'))
            .set('authorization', token)
            .send(updateBusiness[0])
            .expect(httpCodes.NOT_FOUND)
            .expect(res => {
                expect(res.body)
            })
            .end(done);
    });

    it('should not update without authorization', (done) => {
        request(app)
            .put(endpoints.users.owner.BUSINESS_UPDATE.replace(':businessId', businessId))
            .set('authorization', 'Bearer b337e27e-bcf0-4154-8a77-96daa873c9e5')
            .send(updateBusiness[0])
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body)
            })
            .end(done);
    });
    
    it('should not update with an addressId that does not exist', (done) => {
        request(app)
            .put(endpoints.users.owner.BUSINESS_UPDATE.replace(':businessId', businessId))
            .set('authorization', token)
            .send(updateBusiness[10])
            .expect(httpCodes.NOT_FOUND)
            .expect(res => {
                expect(res.body)
            })
            .end(done);
    });

    it('should not update without addressId', (done) => {
        request(app)
            .put(endpoints.users.owner.BUSINESS_UPDATE.replace(':businessId', businessId))
            .set('authorization', token)
            .send(updateBusiness[11])
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body)
            })
            .end(done);
    });

    it('should not update without name', (done) => {
        request(app)
            .put(endpoints.users.owner.BUSINESS_UPDATE.replace(':businessId', businessId))
            .set('authorization', token)
            .send(updateBusiness[12])
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body)
            })
            .end(done);
    });

    it('should not update without latitude and longitude', (done) => {
        request(app)
            .put(endpoints.users.owner.BUSINESS_UPDATE.replace(':businessId', businessId))
            .set('authorization', token)
            .send(updateBusiness[13])
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body)
            })
            .end(done);
    });

    it('should not update without hours', (done) => {
        request(app)
            .put(endpoints.users.owner.BUSINESS_UPDATE.replace(':businessId', businessId))
            .set('authorization', token)
            .send(updateBusiness[14])
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body)
            })
            .end(done);
    });

    it('should not update without categories', (done) => {
        request(app)
            .put(endpoints.users.owner.BUSINESS_UPDATE.replace(':businessId', businessId))
            .set('authorization', token)
            .send(updateBusiness[15])
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body)
            })
            .end(done);
    });
});

describe('DELETE' + endpoints.users.owner.BUSINESS_DELETE, () => {
    beforeEach(async () => {
        await wipeOutDatabase();
        await insertBusinessData();
    });

    it('should delete a business', (done) => {
        request(app)
            .delete(endpoints.users.owner.BUSINESS_DELETE.replace(':businessId', businessId))
            .set('authorization', token)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body['businessDeleted']).toBe(true);
            })
            .end(done);
    });

    it('should not delete a business that does not exist', (done) => {
        request(app)
            .delete(endpoints.users.owner.BUSINESS_DELETE.replace(':businessId', 'a152490c-453f-4b1c-a2c1-58c15cae4cd9'))
            .set('authorization', token)
            .expect(httpCodes.NOT_FOUND)
            .expect(res => {
                expect(res.body['errors'])
            })
            .end(done);
    });

    it('should not delete a business by an unathorized user', (done) => {
        request(app)
            .delete(endpoints.users.owner.BUSINESS_DELETE.replace(':businessId', businessId))
            .set('authorization', 'Bearer b337e27e-bcf0-4154-8a77-96daa873c9e5')
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body['errors'])
            })
            .end(done);
    })
});

describe('GET' + endpoints.users.owner.GET_ALL_BUSINESSES, () => {
    beforeEach(async () => {
        await wipeOutDatabase();
        await insertBusinessData();
    });

    it('should return businesses by userId', (done) => {
        request(app)
            .get(endpoints.users.owner.GET_ALL_BUSINESSES.replace(':userId', userId))
            .set('authorization', token)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body)
            })
            .end(done);
    });

    it('should not return businesses with a wrong userIder', (done) => {
        request(app)
            .get(endpoints.users.owner.GET_ALL_BUSINESSES.replace(':userId', 'eee15b20-917f-4d69-a055-e306d938d196'))
            .set('authorization', token)
            .expect(httpCodes.NOT_FOUND)
            .expect(res => {
                expect(res.body['errors'])
            })
            .end(done);
    });

    it('should not return businesses without authorization', (done) => {
        request(app)
            .get(endpoints.users.owner.GET_ALL_BUSINESSES.replace(':userId', userId))
            .set('authorization', 'Bearer b337e27e-bcf0-4154-8a77-96daa873c9e5')
            .expect(httpCodes.FORBIDDEN)
            .expect(res => {
                expect(res.body['errors'])
            })
            .end(done);
    });
});

describe('GET' + endpoints.GET_BUSINESS, () => {
    beforeEach(async () => {
        await wipeOutDatabase();
        await insertBusinessData();
    });

    it('should return a business', (done) => {
        request(app)
            .get(endpoints.GET_BUSINESS.replace(':businessId', businessId))
            .set('authorization', token)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body)
            })
            .end(done);
    });

    it('should not return a business that does not exist', (done) => {
        request(app)
            .get(endpoints.GET_BUSINESS.replace(':businessId', 'b337e27e-bcf0-4154-8a77-96daa873c9e5'))
            .set('authorization', token)
            .expect(httpCodes.NOT_FOUND)
            .expect(res => {
                expect(res.body['errors'])
            })
            .end(done);
    });
});

describe('GET' + endpoints.users.owner.GET_ALL_CATEGORIES, () => {
    beforeEach(async () => {
        await wipeOutDatabase();
        await createUser({id: 'ebf9b67a-50a4-439b-9af6-25dd7ff4810f', fullname: 'Kevin Cheng', email: 'kevin@gmail.com', password: '12345678', typeLogin: 'email', typeUser: 'normal'});
        await createSession({token: 'fcd84d1f-ee1b-4636-9f61-78dc349f23e5', userId: 'ebf9b67a-50a4-439b-9af6-25dd7ff4810f'});
    });

    it('should return all categories', (done) => {
        request(app)
            .get(endpoints.users.owner.GET_ALL_CATEGORIES)
            .set('authorization', token)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body)
            })
            .end(done);
    });

    it('should not return without authorization', (done) => {
        request(app)
            .get(endpoints.users.owner.GET_ALL_CATEGORIES)
            .set('authorization', 'Bearer ebf9b67a-50a4-439b-9af6-25dd7ff4810f')
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body['errors'])
            })
            .end(done);
    })
});

describe('POST ' + endpoints.businessReview.CREATE_BUSINESS_REVIEW, () => {
    beforeAll(async ()=>{
        await wipeOutDatabase();
        await insertBusinessData();
        await createUser({...users[0]});
        await createUser({...moderator[0]});
        await createUser({...admin[0]});
        await createSession({token: normalToken.split(' ')[1], userId: users[0].id});
        await createSession({token: moderatorToken.split(' ')[1], userId: moderator[0].id});
        await createSession({token: adminToken.split(' ')[1], userId: admin[0].id});
    });

    const businessReview = {
        businessId: expect.stringMatching(config.regex.uuidV4),
        userId: expect.stringMatching(config.regex.uuidV4),
        rating: expect.any(Number),
        description: expect.anything(),
        createdAt: expect.any(String)
    }

    it('user should create business review', done => {
        request(app)
            .post(endpoints.businessReview.CREATE_BUSINESS_REVIEW)
            .set('authorization', normalToken)
            .send({businessId, rating: 4, description: "this is a test"})
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toEqual(businessReview)
            })
            .end(done)
    })

    it('moderator should create business review', done => {
        request(app)
            .post(endpoints.businessReview.CREATE_BUSINESS_REVIEW)
            .set('authorization', moderatorToken)
            .send({businessId, rating: 5, description: "this is good"})
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toEqual(businessReview)
            })
            .end(done)
    })

    it('admin should create business review', done => {
        request(app)
            .post(endpoints.businessReview.CREATE_BUSINESS_REVIEW)
            .set('authorization', adminToken)
            .send({businessId, rating: 3, description: "this is bad"})
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toEqual(businessReview)
            })
            .end(done)
    })

    it('should not create business review with rating greater than 5', done => {
        request(app)
            .post(endpoints.businessReview.CREATE_BUSINESS_REVIEW)
            .set('authorization', normalToken)
            .send({businessId, rating: 6, description: "this is a test"})
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body.errors.length).toBe(1)
            })
            .end(done)
    })

    it('should not create business review with rating less than 1', done => {
        request(app)
            .post(endpoints.businessReview.CREATE_BUSINESS_REVIEW)
            .set('authorization', normalToken)
            .send({businessId, rating: 0, description: "this is a test"})
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body.errors.length).toBe(1)
            })
            .end(done)
    })

    it('should not create business review with description length greater than 200', done => {
        request(app)
            .post(endpoints.businessReview.CREATE_BUSINESS_REVIEW)
            .set('authorization', normalToken)
            .send({businessId, rating: 3, description: genText(201)})
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body.errors.length).toBe(1);
            })
            .end(done)
    })

    it('should not create business review without authorization', done => {
        request(app)
            .post(endpoints.businessReview.CREATE_BUSINESS_REVIEW)
            .send({businessId, rating: 4, description: "this is a test"})
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN)
            })
            .end(done)
    })

    it('should not create business review with false authentication token', done => {
        request(app)
            .post(endpoints.businessReview.CREATE_BUSINESS_REVIEW)
            .set('authorization', normalToken + "1234")
            .send({businessId, rating: 4, description: "this is a test"})
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe('accessToken')
            })
            .end(done)
    })

    it('should not create business review with false businessId (not uuid)', done => {
        request(app)
            .post(endpoints.businessReview.CREATE_BUSINESS_REVIEW)
            .set('authorization', normalToken)
            .send({businessId: "12345", rating: 4, description: "this is a test"})
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body.errors.length).toBeGreaterThan(0)
            })
            .end(done)
    })

    it('should not create business review with false businessId (uuid)', done => {
        request(app)
            .post(endpoints.businessReview.CREATE_BUSINESS_REVIEW)
            .set('authorization', normalToken)
            .send({businessId: genUUID(), rating: 4, description: "this is a test"})
            .expect(httpCodes.NOT_FOUND)
            .expect(res => {
                expect(res.body.error).toBe(errors.NOT_FOUND)
            })
            .end(done)
    })

    it('should not create business review without rating', done => {
        request(app)
            .post(endpoints.businessReview.CREATE_BUSINESS_REVIEW)
            .set('authorization', normalToken)
            .send({businessId, rating: null, description: "this is a test"})
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body.errors.length).toBeGreaterThan(0);
            })
            .end(done)
    })

    it('should not create business review without description', done => {
        request(app)
            .post(endpoints.businessReview.CREATE_BUSINESS_REVIEW)
            .set('authorization', normalToken)
            .send({businessId, rating: 2, description: null})
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body.errors.length).toBeGreaterThan(0);
            })
            .end(done)
    })

    it('should not create business review without businessId', done => {
        request(app)
            .post(endpoints.businessReview.CREATE_BUSINESS_REVIEW)
            .set('authorization', normalToken)
            .send({businessId: null, rating: 2, description: "este negocio es el pedo"})
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body.errors.length).toBeGreaterThan(0);
            })
            .end(done)
    })

    it('should not create business review without body', done => {
        request(app)
            .post(endpoints.businessReview.CREATE_BUSINESS_REVIEW)
            .set('authorization', normalToken)
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body.errors.length).toBeGreaterThan(0);
            })
            .end(done)
    })
});

describe('PUT' + endpoints.businessReview.UPDATE_BUSINESS_REVIEW, () => {
    beforeAll(async ()=>{
        await wipeOutDatabase();
        await insertBusinessData();
        await createUser({...users[0]});
        await createUser({...moderator[0]});
        await createUser({...admin[0]});
        await createSession({token: normalToken.split(' ')[1], userId: users[0].id});
        await createSession({token: moderatorToken.split(' ')[1], userId: moderator[0].id});
        await createSession({token: adminToken.split(' ')[1], userId: admin[0].id});
        await createBusinessReview({businessId, userId, rating: 4, description: 'Description for example'});
        await createBusinessReview({businessId, userId: moderator[0].id, rating: 4, description: 'Description for example'});
        await createBusinessReview({businessId, userId: admin[0].id, rating: 4, description: 'Description for example'});
    });

    const expectedBusinessReview = {
        businessId: expect.stringMatching(config.regex.uuidV4),
        userId: expect.stringMatching(config.regex.uuidV4),
        rating: expect.any(Number),
        description: expect.anything(),
        createdAt: expect.any(String)
    };

    it('should update by an user', (done) => {
        request(app)
            .put(endpoints.businessReview.UPDATE_BUSINESS_REVIEW)
            .set('authorization', token)
            .send({...businessReview[0]})
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toEqual(expectedBusinessReview)
            })
            .end(done);
    });

    it('should upate by a moderator', (done) => {
        request(app)
            .put(endpoints.businessReview.UPDATE_BUSINESS_REVIEW)
            .set('authorization', moderatorToken)
            .send({...businessReview[0]})
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toEqual(expectedBusinessReview)
            })
            .end(done);
    });

    it('should update by an admin', (done) => {
        request(app)
            .put(endpoints.businessReview.UPDATE_BUSINESS_REVIEW)
            .set('authorization', adminToken)
            .send(businessReview[0])
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body).toEqual(expectedBusinessReview)
            })
            .end(done);
    });

    it('should not update with a rating grater than 5', (done) => {
        request(app)
            .put(endpoints.businessReview.UPDATE_BUSINESS_REVIEW)
            .set('authorization', normalToken)
            .send({businessId, rating: 6, description: "this is a test for update"})
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body.errors.length).toBe(1)
            })
            .end(done);
    });

    it('should not update with rating less than 1', (done) => {
        request(app)
            .put(endpoints.businessReview.UPDATE_BUSINESS_REVIEW)
            .set('authorization', normalToken)
            .send({businessId, rating: 0, description: "this is a test for update"})
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body.errors.length).toBe(1)
            })
            .end(done);
    });

    it('should not update with description length greater than 200', (done) => {
        request(app)
            .put(endpoints.businessReview.UPDATE_BUSINESS_REVIEW)
            .set('authorization', normalToken)
            .send({businessId, rating: 4, description: genText(201)})
            .expect(httpCodes.UNPROCESSABLE_ENTITY)
            .expect(res => {
                expect(res.body.errors.length).toBe(1)
            })
            .end(done);
    });

    it('should not update without authorization', (done) => {
        request(app)
            .put(endpoints.businessReview.UPDATE_BUSINESS_REVIEW)
            .send({businessId, rating: 4, description: "this is a test for update"})
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN)
            })
            .end(done);
    });
});

afterAll(()=>{
    knex.destroy();
    server.close();
})