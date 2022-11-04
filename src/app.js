const express = require('express');
const cors = require('cors');

const {
    userRouter
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

module.exports = app;
