import _ from 'lodash'
import { errors } from '../../utils/constants/errors';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import { AppError } from '../../utils/errors/AppError';
import { UserNotFoundError } from '../../utils/errors/UserNotFoundError';
import { User } from '../../database/models/User';
import { raw } from 'objection';
import { Session } from '../../database/models/Session';
import { Business } from '../../database/models/Business';
import { findUser } from '../user/userService';
import { ForbiddenError } from '../../utils/errors/ForbiddenError';

const banUser = async (userId: string) => {
    await User.query().update({ 'deletedAt': new Date() }).where('id', userId);
    await Session.query().delete().where("userId", userId);
    await Business.query().patch({ 'deletedAt': new Date() })
        .where(raw('id IN (SELECT businessId FROM UserBusiness WHERE userId = "' + userId + '")'))
        .andWhere(raw('deletedAt IS NULL'));
}

export const changeModerator = async (email: string, typeUser: 'normal' | 'moderator', ban: boolean) => {
    const user = await findUser("email", email);
    if (!user) throw new UserNotFoundError();
    if (user.typeUser == 'admin') throw new ForbiddenError();

    const updatedRows = await User.query().update({ typeUser }).where('id', user.id);
    if (ban) banUser(user.id);
    return updatedRows != 0;
}

export const allModerators = async () => {
    const moderators = await User.query().select().where('typeUser', 'moderator').andWhere(raw('deletedAt IS NULL'));
    return moderators.map((moderator) => _.pick(moderator, ['id', 'fullname', 'email', 'thumbnailUrl', 'typeUser']));
};
