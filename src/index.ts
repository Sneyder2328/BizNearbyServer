import express from 'express'
import router from './modules/app';
import compression from 'compression';
import knex from './database/knex';
import { Model } from 'objection';
//DATABASE SETTINGS
Model.knex(knex);

export const app = express();

//APP SETTINGS
app.set("PORT", process.env.PORT || 3000);

if (process.env.NODE_ENV == 'development') {
    const morgan = require('morgan');
    app.use(morgan('dev')); // enable logging
}

app.use(compression()); // compress responses
app.use(express.json()); // parse receiving data to json
app.use('/', router); // add all routes

//APP SERVER
export const server = app.listen(app.get('PORT'), () => {
    console.log(`app running on port ${app.get("PORT")}`);
})