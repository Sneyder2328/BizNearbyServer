import _ from 'lodash'
import { errors } from '../../utils/constants/errors';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import { AppError } from '../../utils/errors/appError';
import { AuthError } from '../../utils/errors/authErrors';
import { UserNotFoundError } from '../../utils/errors/userNotFoundError';
import { User } from '../../database/models/User';
import { Session } from '../../database/models/Session';
import { genUUID } from '../../utils/utils';
import { verifyPassword } from '../../utils/utils';

export const signUpUser = async ({ id, fullname, email, phoneNumber, thumbnailUrl, password, typeLogin, typeUser }) => {
    const user = await User.query().findOne('email', email);
    if (user) throw new AppError(httpCodes.CONFLICT, errors.EMAIL, errors.message.EMAIL_TAKEN);

    const insertResult = await User.query().insert({ id, fullname, email, phoneNumber, thumbnailUrl, password, typeLogin, typeUser });

    const accessToken = genUUID();
    await Session.query().insert({ userId: id, token: accessToken });
    return {
        accessToken,
        profile: _.pick(insertResult, ['id', 'fullname', 'email', 'thumbnailUrl', 'typeUser'])
    }
}

export const logInUser = async ({ email, password, typeLogin }) => {
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

    }
    const accessToken = genUUID();
    await Session.query().insert({ userId: user.id, token: accessToken });
    return {
        accessToken,
        profile: _.pick(user, ['id', 'fullname', 'email', 'thumbnailUrl', 'typeUser'])
    };
}