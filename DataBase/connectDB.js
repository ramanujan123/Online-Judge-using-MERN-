// MONGODB 
const mongoose = require('mongoose');
const { dateTimeNowFormated, logger } = require('../utils');

const dbUrl = process.env.DB_URL ;

const connectDB = () => {
    return mongoose.connect(dbUrl)
        .then(() => {
            logger.log("Database Connected !!!");
        })
        .catch(error => {
            logger.error("Oh no MONGOOSE Error !!!", dateTimeNowFormated());
            logger.error(error);
        });
}

module.exports = {
    connectDB
};