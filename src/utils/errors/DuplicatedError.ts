
import { errors } from "../constants/errors";
import { httpCodes } from "../constants/httpResponseCodes";
import { AppError } from "./AppError";

export class DuplicatedError extends AppError {
    constructor() {
        super(httpCodes.CONFLICT, errors.RECORD_DUPLICATED_ERROR, errors.message.RECORD_DUPLICATED);
    }
}