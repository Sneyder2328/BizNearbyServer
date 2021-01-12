import _ from 'lodash'
import { errors } from '../../utils/constants/errors';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import { AppError } from '../../utils/errors/AppError';
import { AuthError } from '../../utils/errors/AuthError';
import { UserNotFoundError } from '../../utils/errors/UserNotFoundError';
import { User } from '../../database/models/User';
import { Session } from '../../database/models/Session';
import { genUUID } from '../../utils/utils';
import { verifyPassword } from '../../utils/utils';
import { verifyFBToken, verifyGoogleToken } from './authService';

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

export const logoutUser = async (accessToken: string): Promise<boolean> => {
    const deletedRows = await Session.query().delete().where('token', accessToken);
    return deletedRows != 0
}