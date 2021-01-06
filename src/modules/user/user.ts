import {Router} from 'express';

const router = Router();

router.post("/users",(req, resp)=>{
    resp.send("HEYY!");
})

export {router as userRouter}
