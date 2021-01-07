const env = (process.env.NODE_ENV || 'development').trim();

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
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
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