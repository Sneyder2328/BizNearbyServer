import _ from 'lodash'
import { errors } from '../../utils/constants/errors';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import { AppError } from '../../utils/errors/AppError';
import { AuthError } from '../../utils/errors/AuthError';
import { UserNotFoundError } from '../../utils/errors/UserNotFoundError';
import { User } from '../../database/models/User';
import { raw } from 'objection';
export const createModerator =async (id: string) => {
        //@ts-ignore
    const user = await User.query().findById(id).andWhere(raw('deletedAt is null'));
    if(!user) throw new AuthError(errors.NOT_FOUND, errors.USER_NOT_FOUND_ERROR);
    if(user.typeUser == 'admin') throw new AppError(httpCodes.FORBIDDEN, errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED);

    const updatedRows = await User.query().patch({'typeUser':'moderator'}).where('id', id);
    return updatedRows != 0;
}