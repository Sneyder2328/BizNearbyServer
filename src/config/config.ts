const path = require('path');
const env = (process.env.NODE_ENV || 'development').trim();

switch(env){
    case 'test':
        require('dotenv').config({path: path.join(__dirname,'..','..','.env.test')});
        break;
    case 'development':
        require('dotenv').config();
        break;
    default:
}

type configType = {
    mode: string,
    connection: {
        host?: string,
        user?: string,
        password?: string,
        database?: string,
    },
    auth: { accessTokenLifeTime: number },
    headers: {
        accessToken: string
    },
    regex: { 
        uuidV4: RegExp, 
        authorization: RegExp 
    },
}

const config: configType = {
    mode: env,
    connection: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    },
    auth: {
        accessTokenLifeTime: 15 * 60 // 15 minutes(in seconds)
    },
    headers: {
        accessToken: 'authorization',
    },
    regex: {
        uuidV4: /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        authorization: /^Bearer\s[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/,
    },
};

export default config;