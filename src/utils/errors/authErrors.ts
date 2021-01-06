import {AppError} from './appError';
import {httpCodes} from '../constants/httpResponseCodes';

export class AuthError extends AppError{
    constructor(error, message=""){
        super(httpCodes.UNAUTHORIZED, error, message);
    }
}