import {AppError} from './appError';
import httpCodes from '../constants/httpResponseCodes';
import error from '../constants/errors';

export class UserNotFoundError extends AppError{
    constructor(message = error.USER_NOT_FOUND_ERROR){
        super(httpCodes.NOT_FOUND, error.USER_NOT_FOUND_ERROR, message);
    }
}