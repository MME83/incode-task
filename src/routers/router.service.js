const router = require('express').Router();

/**
 * @openapi
 * /health:
 *  get:
 *     tags:
 *     - Healthcheck
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.get(
    '/health',
    (_req, res) => res.sendStatus(200)
);

module.exports = router;
