<<<<<<< HEAD
import {Router} from 'express';

const router = Router();

router.post("/users",(req, resp)=>{
    resp.send("HEYY!");
})

export {router as userRouter}
=======
import { Router } from 'express';
import { handleErrorAsync } from '../../middlewares/handleErrorAsync';
import { signUpUser } from './userService';

const router = Router();

router.post("/users", handleErrorAsync(async (req, res) => {
    const {id, fullname} = req.body
    const user = await signUpUser(id, fullname)
    res.json(user);
}))

export { router as userRouter }
>>>>>>> b75594139ab5fbf89a8b48e91ddc82324cda1f06
