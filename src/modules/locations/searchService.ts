import _ from 'lodash'
import { AuthError } from '../../utils/errors/AuthError';
import { User } from '../../database/models/User';
import { City } from '../../database/models/City';
import { raw } from 'objection';

export const searchLocations =async  (pattern: string, sessionId: string,limit: string) => {
    const user = await User.query().findById(sessionId).where(raw('deletedAt IS NULL'));
    if(!user) throw new AuthError();
    const cities = await City.query()
                                .select("City.code", "City.name", "State.name as stateName", "Country.name as countryName")
                                .join(raw('State ON  City.stateCode = State.code'))
                                .join(raw('Country ON State.countryCode = Country.code'))
                                .where(raw('City.name LIKE "%'+ pattern +'%" '))
                                .orWhere(raw('State.name LIKE "%'+ pattern +'%" '))
                                .orderByRaw('(CASE WHEN City.name LIKE "%'+ pattern +'%" THEN 1 '
                                            + 'WHEN state.name LIKE "%'+ pattern +'%" THEN 2 '
                                            + 'ELSE 3 '
                                            + 'END)'
                                            + limit)
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