import dotenv from 'dotenv';
import { resolve } from 'path';

export default class Configurations {
    constructor() {
        dotenv.config({ path: resolve(__dirname, '../../.env') })
    }

    getPort() {
        return process.env.PORT;
    }

    getSeed() {
        return process.env.SEED;
    }

    getHostname() {
        return 'http://localhost';
    }

    getCredencialsMysql() {
        return {
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB,
            port: Number(process.env.MYSQL_PORT),
            connectionLimit: 10
        };
    }

    getLimit() {
        return process.env.LIMIT;
    }

    getAlgorithms() {
        return process.env.ALGORITHMS;
    }

    getSecret() {
        return process.env.SECRET;
    }

    getEmail() {
        return {
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        }
    }

    getMapsApi() {
        return process.env.MAPS_API;
    }

}
