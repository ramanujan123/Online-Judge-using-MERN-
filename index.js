const { dateTimeNowFormated, logger } = require('./utils');

if (process.env.NODE_ENV !== "production" || process.env.CONTAINERIZED === "true") {
    require('dotenv').config(); // .env file variables -> process.env
}

logger.log(`In ${process.env.NODE_ENV} env !`);

const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const explore = require('./routes/explore');
const user = require('./routes/user');
const notes = require('./routes/notes');
const experimental = require('./routes/experimental');
const path = require('path');
const http = require('http');
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const hpp = require('hpp');
const rateLimit = require("express-rate-limit");
const { connectDB } = require('./DataBase/connectDB');
const { Socket } = require('./socketHandler');

const codeExecutorDir = `./CodeExecuter/codeExecutor${(process.env.NO_DOCKER ? "_nodockerv" : "_dockerv")}`;
const { initAllDockerContainers } = require(codeExecutorDir);

// Database Connection
connectDB();
// Initiate All Docker Containers
initAllDockerContainers();

//parse json request body
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//Security
app.use(cors({ origin: true, credentials: true }));
app.use(mongoSanitize());
app.use(hpp());
app.use(helmet());
app.use(rateLimit({
    windowMs: 10 * 60 * 1000, // 10 Minutes
    max: 500
}));

//creating a server
const server = http.createServer(app);
// setup socket connection
Socket.registerSocketServer(server);

// api route to get questions and verdicts
app.use('/api/explore', explore);

// api route to get and post notes
app.use('/api/notes', notes);

// api route for user login and register
app.use('/api/user', user);

// experimental routes
app.use('/api/experimental', experimental);

const port = process.env.PORT || 5000;
server.listen(port, () => {
    logger.log(`Server running on PORT ${port}`, dateTimeNowFormated());
});