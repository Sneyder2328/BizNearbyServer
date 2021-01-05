import knex from 'knex';
import knexConfig from './knexConfig';
import config from '../config/config';

export default knex(knexConfig[config.mode]);