import { DuplicatedError } from "../utils/errors/DuplicatedError";


export const handleErrorAsync = func => async (req,res,next)=>{
    try{
        await func(req,res,next);
    }
    catch(error){
        if (error.name === "UniqueViolationError") {
            return next(new DuplicatedError());
        }
        next(error);
    }
}