import { AppError } from './AppError';
import { httpCodes } from '../constants/httpResponseCodes';
import { errors } from '../constants/errors';

export class ForbiddenError extends AppError {
    constructor(error = errors.FORBIDDEN, message = errors.message.PERMISSION_NOT_GRANTED) {
        super(httpCodes.FORBIDDEN, error, message);
    }
}