const app = require('./app');
const dbConnection = require('./db/dbConnection');
const { createAdmin } = require('./db/dbCreateAdmin');
const { 
    NODE_DOCKER_PORT, 
    MONGODB_USER, 
    MONGODB_PASSWORD, 
    MONGODB_HOST, 
    MONGODB_DOCKER_PORT, 
    MONGODB_DATABASE,
    FADMIN_LOG,
    FADMIN_PASS
} = require('./common/config');
const cronJobs = require('./cron-jobs');
const swaggerDocs = require('./util/swagger');

const start = async () => {
    try {
        const dbUrl = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_DOCKER_PORT}/${MONGODB_DATABASE}?authSource=admin`
        const NODE_PORT = NODE_DOCKER_PORT || 8080;
        
        const connect = await dbConnection(dbUrl);

        if (connect) {
            process.stdout.write('MongoDB connected!\n\n');

            await createAdmin(FADMIN_LOG, FADMIN_PASS);
        }

        app.listen(NODE_PORT, () => {
            process.stdout.write(`App is running on http://localhost:${NODE_PORT}\n\n`);

            cronJobs();

            swaggerDocs(app, NODE_PORT);
        });
    } catch (err) {
        console.error(`Failed to Establish Connection with MongoDB with Error: ${err}`)
    }
};

start();
