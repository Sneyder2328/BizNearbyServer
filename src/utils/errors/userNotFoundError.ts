import { AppError } from './AppError';
import { httpCodes } from '../constants/httpResponseCodes';
import { errors } from '../constants/errors';

export class UserNotFoundError extends AppError {
    constructor(message = errors.message.USER_NOT_FOUND) {
        super(httpCodes.NOT_FOUND, errors.USER_NOT_FOUND_ERROR, message);
    }
}