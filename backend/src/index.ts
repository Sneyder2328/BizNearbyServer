import express from 'express'
import router from './modules/app';
import cors from 'cors';
import {corsOptions} from './middlewares/cors';
import compression from 'compression';

const app = express();
//SETTINGS
app.set("PORT", process.env.PORT || 3000);

//USE
app.use(compression()); //COMPRESS RESPONSES
app.use(express.json()); //PARSE THE RECEIVING DATA TO JSON
app.use(cors(corsOptions)); //MANAGE CORS POLICY
app.use('/',router); //ALL THE ROUTES

//SERVER
app.listen(app.get('PORT'),()=>{
    console.log(`app running on port ${app.get("PORT")}`);
})