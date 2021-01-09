import {AppError} from './appError';
import {httpCodes} from '../constants/httpResponseCodes';
import {errors} from '../constants/errors';
export class AuthError extends AppError{
    constructor(){
        super(httpCodes.UNAUTHORIZED, errors.CREDENTIAL, errors.message.INCORRECT_CREDENTIALS);
    }
}