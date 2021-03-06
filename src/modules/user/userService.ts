import _ from 'lodash';
import { errors } from '../../utils/constants/errors';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import { AppError } from '../../utils/errors/AppError';
import { AuthError } from '../../utils/errors/AuthError';
import { UserNotFoundError } from '../../utils/errors/UserNotFoundError';
import { User } from '../../database/models/User';
import { Business } from '../../database/models/Business';
import { Session } from '../../database/models/Session';
import { genUUID } from '../../utils/utils';
import { verifyPassword } from '../../utils/utils';
import { findUserById, verifyFBToken, verifyGoogleToken } from './authService';
import { raw } from 'objection';

/**
 * Verify if the user exist in the database
 * @function
 * @param {string} userId
 */
export const verifyUser = async (userId: string) => {
    const user = await User.query().findById(userId).where(raw('deletedAt IS NULL'));
    if (!user) {
        throw new AppError(httpCodes.NOT_FOUND, errors.NOT_FOUND, errors.message.USER_NOT_FOUND);
    }
    return user;
};

export const findUser = async (id: string, idContent: string) => User.query().findOne(id, idContent).where(raw('deletedAt IS NULL'));

export const signUpUser = async ({ id, fullname, email, phoneNumber, thumbnailUrl, password, typeLogin }) => {
    const user = await findUser('email', email);
    if (user) throw new AppError(httpCodes.CONFLICT, errors.EMAIL, errors.message.EMAIL_TAKEN);
    const insertResult = await User.query().insert({ id, fullname, email, phoneNumber, thumbnailUrl, password, typeLogin, typeUser: 'normal' });

    const accessToken = genUUID();
    await Session.query().insert({ userId: id, token: accessToken });
    return {
        accessToken,
        profile: _.pick(insertResult, ['id', 'fullname', 'email', 'thumbnailUrl', 'typeUser'])
    }
}

export const logInUser = async ({ email, password, typeLogin, facebookAuth, googleAuth }) => {
    const user = await findUser('email', email);
    if (!user) throw new UserNotFoundError();
    // User is using a different typeLogin than expected
    if (user.typeLogin != typeLogin) {
        throw new AuthError()
    }

    if (typeLogin === "email") { // Verify password
        const isPasswordCorrect = await verifyPassword(password, user.password);
        if (!isPasswordCorrect) throw new AuthError();
    }
    else { // Verify third party token
        const isAuthenticated = (facebookAuth && await verifyFBToken(facebookAuth?.userId, facebookAuth?.token)) ||
            (googleAuth && await verifyGoogleToken(googleAuth?.userId, googleAuth?.token, email));

        if (!isAuthenticated) throw new AuthError();
    }

    const accessToken = genUUID();
    await Session.query().insert({ userId: user.id, token: accessToken });
    return {
        accessToken,
        profile: _.pick(user, ['id', 'fullname', 'email', 'thumbnailUrl', 'typeUser'])
    };
}

export const editUser = async ({ id, fullname, password, email, phoneNumber, thumbnailUrl }) => {
    const userExists = await verifyUser(id);
    if (userExists.typeUser != 'normal' && (email != userExists.email || password != null)) throw new AuthError();
    const emailConflict = await findUser('email', email);
    if (emailConflict && emailConflict.email != email) throw new AppError(httpCodes.CONFLICT, errors.EMAIL, errors.message.EMAIL_TAKEN);


    const userUpdated = await User.query().patchAndFetchById(id, { fullname, password, email, phoneNumber, thumbnailUrl });
    return { profile: _.pick(userUpdated, ['id', 'fullname', 'email', 'thumbnailUrl', 'typeUser']) }
}

export const getProfile = async (userId) => {
    const user = await verifyUser(userId);
    return { profile: _.pick(user, ['id', 'fullname', 'email', 'thumbnailUrl', 'typeUser']) }
}

export const logoutUser = async (accessToken: string): Promise<boolean> => {
    const deletedRows = await Session.query().delete().where('token', accessToken);
    return deletedRows != 0
}

export const deleteUser = async ({ password, id }, sessionId: string) => {
    const user = await findUserById(id);
    const sessionUser = await findUserById(sessionId);
    if (sessionId != user.id) {
        switch (sessionUser.typeUser) {
            case 'admin':
                if (user.typeUser == 'admin') throw new AuthError(errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED);
                break;
            case 'moderator':
                if (user.typeUser != 'normal') throw new AuthError(errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED);
                break;
            default:
                throw new AuthError(errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED);
        }
    }
    if (password != null || sessionUser.typeLogin == 'email') {
        const isPasswordCorrect = await verifyPassword(password, sessionUser.password);
        if (!isPasswordCorrect) throw new AuthError(errors.CREDENTIAL, errors.message.INCORRECT_CREDENTIALS);
    }
    const userDeleted = await User.query().updateAndFetchById(id, { 'deletedAt': new Date() });
    await Session.query().delete().where("userId", id);
    await Business.query().patch({ 'deletedAt': new Date() })
        .where(raw('id IN (SELECT businessId FROM UserBusiness WHERE userId = "' + userDeleted.id + '")'))
        .andWhere(raw('deletedAt IS NULL'));
    return userDeleted.deletedAt != null;
}

export const deleteMultipleUsers = async ({ password, ids }, sessionId: string) => {
    const sessionUser = await findUserById(sessionId);
    if (password != null || sessionUser.typeLogin == 'email') {
        const isPasswordCorrect = await verifyPassword(password, sessionUser.password);
        if (!isPasswordCorrect) throw new AuthError(errors.CREDENTIAL, errors.message.INCORRECT_CREDENTIALS);
    }

    const users = await User.query().findByIds(ids).where(raw('deletedAt IS NULL'));
    if (users.some(user => user.id == sessionId))
        throw new AppError(httpCodes.FORBIDDEN, errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED);
    switch (sessionUser.typeUser) {
        case 'normal':
            throw new AppError(httpCodes.FORBIDDEN, errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED);
        case 'moderator':
            if (users.some(user => user.typeUser != 'normal'))
                throw new AppError(httpCodes.FORBIDDEN, errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED);
            break;
        case 'admin':
            if (users.some(user => user.typeUser == 'admin'))
                throw new AppError(httpCodes.FORBIDDEN, errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED);
            break;
        default:
    }

    let whereQuery: string = "";
    users.forEach((user, index) => {
        whereQuery += "id = '" + user.id + "' OR ";
        if (index == users.length - 1) whereQuery = whereQuery.substr(0, whereQuery.length - 4);
    })

    await User.query().update({ 'deletedAt': new Date() }).where(raw(whereQuery));
    whereQuery = whereQuery.replace(/id =/g, "userId =");
    await Business.query().patch({ 'deletedAt': new Date() })
        .where(raw('id IN (SELECT businessId FROM UserBusiness WHERE ' + whereQuery + ')'))
        .andWhere(raw('deletedAt IS NULL'));
    await Session.query().delete().where(raw(whereQuery));
    const usersDeleted = await User.query().select("id").findByIds(ids).where(raw('deletedAt IS NOT NULL'));
    const usersIdDeleted = usersDeleted.map(user => user.id);
    return ids.map(id => { return { updated: usersIdDeleted.includes(id) } });
}
