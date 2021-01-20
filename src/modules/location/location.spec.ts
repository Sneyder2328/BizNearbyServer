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
    const city = (query: string) => {return {
        city: {
            name: expect.stringMatching(new RegExp(query,'i')),
            code: expect.anything()
        },
        state: {
            name: expect.anything()
        },
        country: {
            name: expect.anything()
        }
    }}

    beforeAll(async ()=>{
        await wipeOutDatabase();
        //@ts-ignore
        await createUser(users[0]);
        await createSession({token: token.split(' ')[1], userId: users[0].id});
    })

    it('should return every city or state with "El Tocuyo" in it', done => {
        request(app)
            .get(endpoints.LOCATION_AUTOCOMPLETE + "?query=El Tocuyo")
            .set('authorization', token)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.length).toBeGreaterThan(0);
                expect(res.body[0]).toEqual(city('El Tocuyo'));
            })
            .end(done)
    })

    it('should return every city or state with "El Tocuyo" in it (query with too much whitespace)', done => {
        request(app)
            .get(endpoints.LOCATION_AUTOCOMPLETE + "?query=    El         Tocuyo    ")
            .set('authorization', token)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.length).toBeGreaterThan(0);
                expect(res.body[0]).toEqual(city('El Tocuyo'));
            })
            .end(done)
    })

    it('should return 10 cities or states with "a" in it', done => {
        request(app)
            .get(endpoints.LOCATION_AUTOCOMPLETE + "?query=a&limit=10")
            .set('authorization', token)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.length).toBe(10)
                expect(res.body[0]).toEqual(city('a'));
            })
            .end(done)
    })

    it('should return every city or state with "  toc  " in it', done => {
        request(app)
            .get(endpoints.LOCATION_AUTOCOMPLETE + "?query=  toc  ")
            .set('authorization', token)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.length).toBeGreaterThan(0);
                expect(res.body[0]).toEqual(city('toc'));
            })
            .end(done)
    })

    it('should return 20 cities or states with "toc" in it', done => {
        request(app)
            .get(endpoints.LOCATION_AUTOCOMPLETE + "?query=toc&limit=20")
            .set('authorization', token)
            .expect(httpCodes.OK)
            .expect(res => {
                expect(res.body.length).toBeLessThanOrEqual(20);
                expect(res.body[0]).toEqual(city('toc'));
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