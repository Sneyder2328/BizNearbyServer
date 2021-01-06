import { errors } from '../../utils/constants/errors';
import { httpCodes } from '../../utils/constants/httpResponseCodes';
import { AppError } from '../../utils/errors/appError';
import { User } from '../../database/models/User';
import { Session } from '../../database/models/Session';
import { genUUID } from '../../utils/utils';

export const signUpUser = async (user) => {
    const { id, fullname, email, thumbnailUrl } = user;
    console.log(user);
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

export const logInUser = async (email: string, password: string) => {
    return { email, password };
}