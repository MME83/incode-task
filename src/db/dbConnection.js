const mongoose = require('mongoose');

const dbConnection = async (dbPath) => {
    const connected = await mongoose.connect(
        dbPath,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }
    );

    return connected;
};

module.exports = dbConnection;
