import {AppError} from './appError';
import {httpCodes} from '../constants/httpResponseCodes';
import {errors} from '../constants/errors';

export class UserNotFoundError extends AppError{
    constructor(message = errors.USER_NOT_FOUND_ERROR){
        super(httpCodes.NOT_FOUND, errors.USER_NOT_FOUND_ERROR, message);
    }
}