import express from 'express'
import router from './modules/app';
import compression from 'compression';
import morgan from 'morgan';
import knex from './database/knex';
import {Model} from 'objection';

export const app = express();
//DATABASE SETTINGS
Model.knex(knex);

//APP SETTINGS
app.set("PORT", process.env.PORT || 3000);

//APP USE
app.use(morgan('dev')); //TO VIEW SERVER DATA
app.use(compression()); //COMPRESS RESPONSES
app.use(express.json()); //PARSE THE RECEIVING DATA TO JSON
app.use('/',router); //ALL THE ROUTES

//APP SERVER
export const server = app.listen(app.get('PORT'),()=>{
    console.log(`app running on port ${app.get("PORT")}`);
})