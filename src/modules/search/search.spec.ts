import request from "supertest";
import {app, server} from "../../index";
import {wipeOutDatabase, createUser, createSession} from "../../test/setup";
import {endpoints} from "../../utils/constants/endpoints";
import {httpCodes} from "../../utils/constants/httpResponseCodes";
import {admin, users, moderator} from "../../test/seed";
import {errors} from "../../utils/constants/errors";
import knex from "../../database/knex";

const token = "Bearer fcd84d1f-ee1b-4636-9f61-78dc349f23e5";

describe('GET ' + endpoints.LOCATION_AUTOCOMPLETE, () => {
    beforeAll(async ()=>{
        await wipeOutDatabase();
        //@ts-ignore
        await createUser(users[0]);
        await createSession({token: token.split(' ')[1], userId: users[0].id});
    })

    it('should return every city with "tocuyo" in it', done => {
        const city ={
            city: {
                name: expect.stringMatching(/tocuyo/i),
                code: expect.anything()
            },
            state: {
                name: expect.anything()
            },
            country: {
                name: expect.anything()
            }
        }

        request(app)
            .get(endpoints.LOCATION_AUTOCOMPLETE + "?query=El Tocuyo")
            .set('authorization', token)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.length).toBeGreaterThan(0);
                expect(res.body[0]).toEqual(city);
            })
            .end(done)
    })

    it('should return every city with "  com  " in it', done => {
        const city ={
            city: {
                name: expect.stringMatching(/toc/i),
                code: expect.anything()
            },
            state: {
                name: expect.anything()
            },
            country: {
                name: expect.anything()
            }
        }

        request(app)
            .get(endpoints.LOCATION_AUTOCOMPLETE + "?query=  toc  ")
            .set('authorization', token)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.length).toBeGreaterThan(0);
                expect(res.body[0]).toEqual(city);
            })
            .end(done)
    })

    it('should return authorization error', done => {
        request(app)
            .get(endpoints.LOCATION_AUTOCOMPLETE + "?query=  toc  ")
            .expect(httpCodes.UNAUTHORIZED)
            .expect(res => {
                expect(res.body.error).toBe(errors.FORBIDDEN);
            })
            .end(done)
    })
    
})

afterAll(()=>{
    knex.destroy();
    server.close();
})