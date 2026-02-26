/**
 * @swagger
 * /metrics:
 *   get:
 *     summary: Expose les métriques Prometheus
 *     tags:
 *       - Monitoring
 *     responses:
 *       200:
 *         description: Métriques au format Prometheus
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */