const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { version } = require('../../package.json');

const options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'REST API Docs',
            version
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{ bearerAuth: []}],
    },
    apis: ['./src/routers/*.js', './src/docs/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
    // Swagger page
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Docs in JSON format
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    process.stdout.write(`Docs api available at http://localhost:${port}/docs \n`);
    process.stdout.write(`Docs in JSON available at http://localhost:${port}/docs.json \n`);
};

module.exports = swaggerDocs;
