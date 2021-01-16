import _ from 'lodash'
import { errors } from '../../utils/constants/errors';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import { AppError } from '../../utils/errors/AppError';
import { AuthError } from '../../utils/errors/AuthError';
import { UserNotFoundError } from '../../utils/errors/UserNotFoundError';
import { User } from '../../database/models/User';
import { City } from '../../database/models/City';
import { Business } from '../../database/models/Business';
import { Session } from '../../database/models/Session';
import { genUUID } from '../../utils/utils';
import { verifyPassword } from '../../utils/utils';
import { raw } from 'objection';

export const searchLocations =async  (pattern: string, sessionId: string) => {
    const user = await User.query().findById(sessionId).where(raw('deletedAt IS NULL'));
    if(!user) throw new AuthError();
    //PATTERN ALGORITHM
    const query = 'city.code, city.name AS cityName, country.name AS countryName, state.name AS stateName FROM CITY INNER JOIN state ON  city.stateCode = state.code INNER JOIN country ON state.countryCode = country.code'
    const cities = await City.query().select(raw(query));
    return {searchResult: 0}
}