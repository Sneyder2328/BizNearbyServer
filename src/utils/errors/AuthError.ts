import { AppError } from './appError';
import { httpCodes } from '../constants/httpResponseCodes';
import { errors } from '../constants/errors';
export class AuthError extends AppError {
    constructor(error?: any, message?: string) {
        super(httpCodes.UNAUTHORIZED, error || errors.CREDENTIAL, message || errors.message.INCORRECT_CREDENTIALS);
    }
}