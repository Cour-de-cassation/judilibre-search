/**
 * @swagger
 * /published:
 *   post:
 *     security:
 *       - access: []
 *     summary: Vérifie si des décisions sont publiées
 *     tags:
 *       - Décision
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: array
 *                 items:
 *                   type: string
 *           example:
 *             id:
 *               - "69427fdc62345a940dcc7cc1"
 *               - "5fca7d162a251e6bf9c78514"
 *     responses:
 *       200:
 *         description: Statut de publication des décisions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               69427fdc62345a940dcc7cc1: false
 *               took: 39
 *       400:
 *         description: Requête invalide.
 *       500:
 *         description: Erreur indéfinie côté serveur.
 */