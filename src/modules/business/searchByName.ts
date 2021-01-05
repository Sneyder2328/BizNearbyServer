import {Router} from 'express';

const router = Router();

router.get("/business",(req, resp)=>{
    resp.send("Business");
})

export {router as userRouter}