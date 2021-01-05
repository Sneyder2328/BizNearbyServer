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
