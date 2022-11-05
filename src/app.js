const express = require('express');
const cors = require('cors');

const {
    userRouter,
    authRouter
} = require('./routers');

const app = express();
const corsOptions = {
    origin: 'http://localhost:8081'
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use('/', (req, res, next) => {
    if (req.originalUrl === '/') {
        res.send('Server is running');
        return;
    }

    next();
});

app.use('/users', userRouter);
app.use('/auth', authRouter);

app.use((err, req, res, next) => {
    console.warn(`Unexpected error: ${err.message}`);
    res.status(500).json({ error: err.message });
});

process.on('unhandledRejection', (reason) => {
    console.error(`FATAL ERROR: Unhandled Promise Rejection ${reason.message} stack: ${reason.stack}`);
});

process.on('SIGTERM', function () {
    console.log('Server shutting down gracefully');
    process.exit();
});

process.on('SIGINT', function () {
    console.log('Server down gracefully');
    process.exit();
});

process.on('uncaughtException', function (err) {
    let msg = `${new Date().toUTCString()} uncaughtException: ${err.message}, stack: ${err.stack}\n`;
    console.log(msg);
    process.exit();
});

module.exports = app;
