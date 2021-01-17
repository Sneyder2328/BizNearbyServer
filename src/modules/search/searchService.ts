import _ from 'lodash'
import { AuthError } from '../../utils/errors/AuthError';
import { User } from '../../database/models/User';
import { City } from '../../database/models/City';
import { raw } from 'objection';

export const searchLocations =async  (pattern: string, sessionId: string,limit: string) => {
    const user = await User.query().findById(sessionId).where(raw('deletedAt IS NULL'));
    if(!user) throw new AuthError();
    const cities = await City.query()
                                .select("city.code", "city.name", "state.name as stateName", "country.name as countryName")
                                .join(raw('state ON  city.stateCode = state.code'))
                                .join(raw('country ON state.countryCode = country.code'))
                                .where(raw('city.name LIKE "%'+ pattern +'%" ' + limit));
    const searchResult = cities.map(city => {
        return {
            city: {
                name: city['name'],
                code: city['code']
            },
            state: {
                name: city['stateName']
            },
            country: {
                name: city['countryName']
            }
        }
    })
    return searchResult;
}