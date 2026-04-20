/**
 * @swagger
 * /healthcheck:
 *   get:
 *     security:
 *       - access: []
 *     summary: Vérifie la disponibilité du service
 *     tags:
 *       - Monitoring
 *     responses:
 *       200:
 *         description: Statut de disponibilité d'Elastic
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [disponible, indisponible]
 *                   example: disponible
 */