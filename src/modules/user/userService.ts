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

export const signUpUser = async (user) => {
    const { id, fullname, email, phoneNumber, thumbnailUrl, password, typeLogin, typeUser } = user;
    //VALIDATION IN DATABASE
    const userWithEmail = await User.query().findOne('email', email);
    if (userWithEmail) throw new AppError(httpCodes.CONFLICT, errors.EMAIL, errors.message.EMAIL_TAKEN);

    //INSERT USER TO DATABASE
    const insertResult = await User.query().insert({ id, fullname, email, phoneNumber, thumbnailUrl, password, typeLogin, typeUser });
    console.log('insertResult=', insertResult);

    const accessToken = genUUID();
    await Session.query().insert({ userId: id, token: accessToken });
    return {
        accessToken,
        profile: _.pick(insertResult, ['id', 'fullname', 'email', 'thumbnailUrl', 'typeUser'])
    }
}

export const logInUser = async (user) => {
    const userWithEmail = await User.query().findOne('email', user.email);
    if (!userWithEmail) throw new UserNotFoundError();

    if (user.typeLogin === "email") { // Verify password
        if (!userWithEmail) throw new AuthError();
        const validPass = await verifyPassword(user.password, userWithEmail.password);
        if (!validPass) throw new AuthError();
    }
    else { // Verify third party token
        
    }
    const { id, fullname, email, thumbnailUrl } = userWithEmail;
    const uuid = genUUID();
    await Session.query().insert({ userId: id, token: uuid });
    return { id, fullname, email, thumbnailUrl, uuid };
}