import {Router} from 'express';

const router = Router();

router.get("/",(req, resp)=>{
    resp.send("Hello World");
})

export default router;