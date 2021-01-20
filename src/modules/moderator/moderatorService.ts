import _ from 'lodash'
import { errors } from '../../utils/constants/errors';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import { AppError } from '../../utils/errors/AppError';
import { UserNotFoundError } from '../../utils/errors/UserNotFoundError';
import { User } from '../../database/models/User';
import { raw } from 'objection';
import { Session } from '../../database/models/Session';
import { Business } from '../../database/models/Business';

export const changeModerator =async (email: string, typeUser: 'normal'|'moderator', ban: boolean) => {
    const user = await User.query().findOne({email}).where(raw('deletedAt is null'));
    if(!user) throw new UserNotFoundError();
    if(user.typeUser == 'admin') throw new AppError(httpCodes.FORBIDDEN, errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED);

    const updatedRows = await User.query().update({typeUser}).where('id', user.id);
    if(ban){
        await User.query().update({'deletedAt': new Date()}).where('id',user.id);
        await Session.query().delete().where("userId", user.id);
        await Business.query().patch({'deletedAt': new Date()})
            .where(raw('id IN (SELECT businessId FROM UserBusiness WHERE userId = "'+ user.id +'")'))
            .andWhere(raw('deletedAt IS NULL'));
    }
    return updatedRows != 0;
}

export const allModerators = async () => {
    const moderators = await User.query().select().where('typeUser', 'moderator').andWhere(raw('deletedAt IS NULL'));
    return moderators.map((moderator) => _.pick(moderator, ['id', 'fullname', 'email', 'thumbnailUrl', 'typeUser']));
};
