import config from '../config/config';

export default {
    development: {
        client: 'mysql',
        connection: config.connection,
        debug: true,
    },
    test: {
        client: 'mysql',
        connection: config.connection,
        debug: true,
    },
    production: {
        client: 'mysql',
        connection: config.connection,
        pool: {
            min: 2,
            max: 10,
        }
    }
}