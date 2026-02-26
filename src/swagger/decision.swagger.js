/**
 * @swagger
 * /decision:
 *   get:
 *     summary: Récupère une décision de justice
 *     tags:
 *       - Décision
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant de la décision à récupérer.
 *       - in: query
 *         name: resolve_references
 *         required: false
 *         schema:
 *           type: boolean
 *         description: >
 *           Lorsque ce paramètre vaut `true`, le résultat de la requête contiendra,
 *           pour chaque information retournée par défaut sous forme de clé,
 *           l'intitulé complet de celle-ci (vaut `false` par défaut).
 *       - in: query
 *         name: query
 *         required: false
 *         schema:
 *           type: string
 *           maxLength: 512
 *         description: >
 *           Chaîne de caractères correspondant à la recherche. Ce paramètre est utilisé
 *           pour surligner en retour, dans le texte intégral de la décision, les termes
 *           correspondant avec la recherche initiale (ces termes étant délimitées par
 *           des balises `<em>`).
 *       - in: query
 *         name: operator
 *         required: false
 *         schema:
 *           type: string
 *           enum: [or, and, exact]
 *         description: >
 *           Opérateur logique reliant les multiples termes que le paramètre `query` peut
 *           contenir (`or` par défaut, `and` ou `exact` – dans ce dernier cas le moteur
 *           recherchera exactement le contenu du paramètre `query`).
 *     responses:
 *       200:
 *         description: Décision trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Decision'
 *       400:
 *         description: Paramètres invalides
 *       404:
 *         description: Décision non trouvée
 *       500:
 *         description: Erreur interne
 *
 * components:
 *   schemas:
 *     Decision:
 *       type: object
 *       example:
 *         id: "5fca7d162a251e6bf9c78514"
 *         jurisdiction: "cc"
 *         chamber: "civ3"
 *         number: "17-18.194"
 *         numbers:
 *           - "17-18.194"
 *           - "16-21.165"
 *         ecli: "ECLI:FR:CCASS:2018:C301117"
 *         formation: "fs"
 *         publication:
 *           - "c"
 *           - "b"
 *         decision_date: "2018-12-20"
 *         decision_datetime: "2018-12-20T06:00:00Z"
 *         update_date: "2018-12-26"
 *         update_datetime: "2018-12-26T11:00:00Z"
 *         type: "arret"
 *         solution: "rejet"
 *         summary: "Le titulaire d'une autorisation temporaire d'occupation..."
 *         themes:
 *           - "Expropriation pour cause d'utilité publique"
 *           - "Indemnité"
 *         text: "CIV.3 \r\nCH.B\r\n..."
 *         zones:
 *           introduction:
 *             - start: 0
 *               end: 2309
 *           motivations:
 *             - start: 2309
 *               end: 4834
 *           dispositif:
 *             - start: 4834
 *               end: 5199
 *           annexes:
 *             - start: 5199
 *               end: 16798
 *       properties:
 *         id:
 *           type: string
 *         jurisdiction:
 *           type: string
 *         chamber:
 *           type: string
 *         number:
 *           type: string
 *         numbers:
 *           type: array
 *           items:
 *             type: string
 *         ecli:
 *           type: string
 *         formation:
 *           type: string
 *         publication:
 *           type: array
 *           items:
 *             type: string
 *         decision_date:
 *           type: string
 *           format: date
 *         decision_datetime:
 *           type: string
 *           format: date-time
 *         update_date:
 *           type: string
 *           format: date
 *         update_datetime:
 *           type: string
 *           format: date-time
 *         type:
 *           type: string
 *         solution:
 *           type: string
 *         summary:
 *           type: string
 *         themes:
 *           type: array
 *           items:
 *             type: string
 *         text:
 *           type: string
 *         zones:
 *           type: object
 *           properties:
 *             introduction:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: integer
 *                   end:
 *                     type: integer
 *             motivations:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: integer
 *                   end:
 *                     type: integer
 *             dispositif:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: integer
 *                   end:
 *                     type: integer
 *             annexes:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: integer
 *                   end:
 *                     type: integer
 */