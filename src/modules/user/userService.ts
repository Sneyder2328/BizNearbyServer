import { errors } from '../../utils/constants/errors';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import { AppError } from '../../utils/errors/appError';
import { AuthError } from '../../utils/errors/authErrors';
import { UserNotFoundError } from '../../utils/errors/userNotFoundError';
import { User } from '../../database/models/User';
import { Session, SessionObject } from '../../database/models/Session';
import { genUUID } from '../../utils/utils';
import { verifyPassword } from '../../utils/utils';

export const signUpUser = async (user) => {
    const { id, fullname, email, thumbnailUrl } = user;
    //VALIDATION IN DATABASE
    const userWithEmail = await User.query().findOne('email', email);
    if (userWithEmail) throw new AppError(httpCodes.CONFLICT, errors.EMAIL, errors.message.EMAIL_TAKEN);

    //INSERT USER TO DATABASE
    await User.query().insert(user);

    //GENERATE UUIDV4 AND STORE IT IN DATABASE
    const uuid = genUUID();
    await Session.query().insert({ userId: id, token: uuid });
    return { id, fullname, email, thumbnailUrl, uuid };
}

export const logInUser = async (user) => {
    const userWithEmail = await User.query().findOne('email', user.email);
    if (user.typeLogin === "email") {
        //VALIDATION
        if (!userWithEmail) throw new AuthError();
        const validPass = await verifyPassword(user.password, userWithEmail.password);
        if (!validPass) throw new AuthError();
    }
    else {
        //AUTHENTICATION PROCESS ...
        if (!userWithEmail) throw new UserNotFoundError();
    }
    const { id, fullname, email, thumbnailUrl } = userWithEmail;
    //GENERATE UUIDV4 
    const uuid = genUUID();
    await Session.query().insert({ userId: id, token: uuid });
    return { id, fullname, email, thumbnailUrl, uuid };
}

export const findSession = async (accessToken: string): Promise<SessionObject> => {
    return await Session.query().findById(accessToken)
}

export const isSessionExpired = (session: SessionObject): boolean => {
    console.log('Session', session.createdAt, new Date());
    return false
}