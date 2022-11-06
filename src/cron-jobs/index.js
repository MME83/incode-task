const cron = require('node-cron');
const removeTokens = require('./remove.tokens');

module.exports = () => {
    cron.schedule('0 1 1,2 * *', () => {
        process.stdout.write(`Cron started at ${new Date().toISOString()}\n`);

        removeTokens();

        process.stdout.write(`Cron ended at ${new Date().toISOString()}\n`);
    });
};
