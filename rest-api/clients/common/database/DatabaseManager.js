const { createConnection } = require('typeorm');
const { Constants } = require('../Constants');
const { CustomError } = require('../errors/CustomError');
const { Notification } = require('../../notification/entities/Notification.entity');
require('dotenv').config();

class DatabaseManager {
    constructor() {
        if (DatabaseManager.connection !== undefined) {
            return DatabaseManager.connection;
        }

        this.connection = undefined;
    }

    async getConnection() {
        try {
            if (this.connection === undefined) {
                if (process.env.NODE_ENV === 'development') {
                    this.connection = await createConnection({
                        type: 'mysql',
                        host: process.env.DATABASE_HOST_DEV,
                        port: process.env.DATABASE_PORT_DEV,
                        username: process.env.DATABASE_USERNAME_DEV,
                        password: process.env.DATABASE_PASSWORD_DEV,
                        database: process.env.DATABASE_NAME_DEV,
                        synchronize: true,
                        logging: false,
                        entities: [
                            Notification,
                        ],
                    });
                } else {
                    this.connection = await createConnection({
                        type: 'mysql',
                        host: process.env.DATABASE_HOST,
                        port: process.env.DATABASE_PORT,
                        username: process.env.DATABASE_USERNAME,
                        password: process.env.DATABASE_PASSWORD,
                        database: process.env.DATABASE_NAME,
                        synchronize: true,
                        logging: false,
                        entities: [
                            Notification,
                        ],
                        ssl: {
                            rejectUnauthorized: false,
                        },
                    });

                }

                console.log(Constants.DATABASE_CONNECTION_ESTABLISHED, this.connection.options.host);
            }

            return this.connection;
        } catch (error) {
            console.error(Constants.ERROR_CONNECTING_DATABASE, error);
            throw new CustomError(Constants.ERROR_CONNECTING_DATABASE, error.message);
        }
    }
}

module.exports.DatabaseManager = DatabaseManager;
