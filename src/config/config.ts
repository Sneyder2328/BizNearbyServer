
import * as dotenv from "dotenv";
import path from 'path';
dotenv.config({path: path.join(__dirname,'..','..','.env')});
const env = (process.env.NODE_ENV || 'development').trim();
//POR ALGUNA RAZON NO FUNCIONAN LAS ENV...

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
        token: string
    },
    regex: { uuidV4: any },
}

const config: configType = {
    mode: env,
    connection: {
        host: process.env.MYSQL_HOST || "localhost",
        user: process.env.MYSQL_USER || "root",
        password: process.env.MYSQL_PASSWORD || "password",
        database: process.env.MYSQL_DATABASE || "biznearby",
    },
    auth: {
        accessTokenLifeTime: 15 * 60 // 15 minutes(in seconds)
    },
    headers: {
        token: 'accessToken',
    },
    regex: {
        uuidV4: /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    },
};

export default config;