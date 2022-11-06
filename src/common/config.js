const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.join(__dirname, '../../.env')
});

module.exports = {
    NODE_DOCKER_PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_USER: process.env.MONGODB_USER,
    MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
    MONGODB_HOST: process.env.MONGODB_HOST,
    MONGODB_DOCKER_PORT: process.env.MONGODB_DOCKER_PORT,
    MONGODB_DATABASE: process.env.MONGODB_DATABASE,
    SALT: process.env.SALT,
    FADMIN_LOG: process.env.FADMIN_LOG,
    FADMIN_PASS: process.env.FADMIN_PASS,
    SECRET_ACCESS: process.env.SECRET_ACCESS,
    SECRET_REFRESH: process.env.SECRET_REFRESH
};
