import _ from 'lodash'
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
import { verifyFBToken, verifyGoogleToken } from './authService';
import { raw } from 'objection';

export const signUpUser = async ({ id, fullname, email, phoneNumber, thumbnailUrl, password, typeLogin }) => {
    const user = await User.query().findOne('email', email);
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
    const user = await User.query().findOne('email', email);
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
    const userExists = await User.query().findById(id);
    if (!userExists) throw new UserNotFoundError();
    const emailConflict = await User.query().findOne({'email': email})
    if (emailConflict && emailConflict.email != email) throw new AppError(httpCodes.CONFLICT, errors.EMAIL, errors.message.EMAIL_TAKEN);

    const userUpdated = await User.query().patchAndFetchById(id, { fullname, password, email, phoneNumber, thumbnailUrl });
    return { profile: _.pick(userUpdated, ['id', 'fullname', 'email', 'thumbnailUrl', 'typeUser']) }
}

export const logoutUser = async (accessToken: string): Promise<boolean> => {
    const deletedRows = await Session.query().delete().where('token', accessToken);
    return deletedRows != 0
}

export const deleteUser = async ({password, id}, sessionId) => {
    const user = await User.query().findOne('id', id).where(raw('deletedAt IS NULL'));
    if(!user) throw new AuthError(errors.NOT_FOUND, errors.message.USER_NOT_FOUND);
    const sessionUser = await User.query().findOne('id', sessionId).where(raw('deletedAt IS NULL'));
    if(!sessionUser) throw new AuthError();
    if(sessionId != user.id){
        switch(sessionUser.typeUser){
            case 'admin':
                if(user.typeUser == 'admin') throw new AuthError(errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED);
                break;
            case 'moderator':
                if(user.typeUser != 'normal') throw new AuthError(errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED);
                break;
            default:
                throw new AuthError(errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED);
        }
    }
    if(password != null || sessionUser.typeLogin=='email'){
        const isPasswordCorrect = await verifyPassword(password, sessionUser.password);
        if(!isPasswordCorrect) throw new AuthError(errors.CREDENTIAL, errors.message.INCORRECT_CREDENTIALS);      
    }
    const userDeleted = await User.query().updateAndFetchById(id, {'deletedAt': new Date()});
    await Business.query().patch({'deletedAt': new Date()})
        .where(raw('id IN (SELECT businessId FROM UserBusiness WHERE userId = "'+ userDeleted.id +'")'))
        .andWhere(raw('deletedAt IS NULL'));
    
    return userDeleted.deletedAt != null;
}

export const deleteMultipleUsers = async ({password, ids}, sessionId) => {
    const users = ids.map(async id => {
        return await User.query().findOne('id', id).where(raw('deletedAt IS NULL'));
        
    })

    const user = await User.query().findOne('id', id).where(raw('deletedAt IS NULL'));
    if(!user) throw new AuthError(errors.NOT_FOUND, errors.message.USER_NOT_FOUND);
    const sessionUser = await User.query().findOne('id', sessionId).where(raw('deletedAt IS NULL'));
    if(!sessionUser) throw new AuthError();
    if(sessionId != user.id){
        switch(sessionUser.typeUser){
            case 'admin':
                if(user.typeUser == 'admin') throw new AuthError(errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED);
                break;
            case 'moderator':
                if(user.typeUser != 'normal') throw new AuthError(errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED);
                break;
            default:
                throw new AuthError(errors.FORBIDDEN, errors.message.PERMISSION_NOT_GRANTED);
        }
    }
    if(password != null || sessionUser.typeLogin=='email'){
        const isPasswordCorrect = await verifyPassword(password, sessionUser.password);
        if(!isPasswordCorrect) throw new AuthError(errors.CREDENTIAL, errors.message.INCORRECT_CREDENTIALS);      
    }
    const userDeleted = await User.query().updateAndFetchById(id, {'deletedAt': new Date()});
    await Business.query().patch({'deletedAt': new Date()})
        .where(raw('id IN (SELECT businessId FROM UserBusiness WHERE userId = "'+ userDeleted.id +'")'))
        .andWhere(raw('deletedAt IS NULL'));
    
    return userDeleted.deletedAt != null;
}