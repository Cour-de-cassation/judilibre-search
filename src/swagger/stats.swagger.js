/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Permet de récupérer des statistiques sur le contenu de la base JUDILIBRE.
 *     tags:
 *       - Statistiques
 *     description: >
 *       Ce point d'entrée publie les statistiques suivantes, mises à jour quotidiennement :
 *       nombre de décisions indexées (au total, par année, par juridiction),
 *       nombre de requêtes (par jour, par semaine, etc.),
 *       date de la décision la plus ancienne et la plus récente.
 *     parameters:
 *       - in: query
 *         name: jurisdiction
 *         required: false
 *         schema:
 *           type: string
 *           enum: [cc, ca, tj, tcom]
 *         description: >
 *           Filtre pour ne retourner les résultats que pour un type de juridiction.
 *           Par défaut, retourne toutes les juridictions.
 *       - in: query
 *         name: location
 *         required: false
 *         schema:
 *           type: string
 *         description: >
 *           Filtre pour ne retourner les résultats que pour une juridiction précise.
 *           On peut spécifier plusieurs valeurs en les séparant par des virgules (ex: `ca_paris,ca_rennes`).
 *           Les valeurs disponibles sont accessibles via `GET /taxonomy`.
 *       - in: query
 *         name: date_start
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Date minimale utilisée pour filtrer les résultats, au format `YYYY-MM-DD`.
 *       - in: query
 *         name: date_end
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Date maximale utilisée pour filtrer les résultats, au format `YYYY-MM-DD`.
 *       - in: query
 *         name: particularInterest
 *         required: false
 *         schema:
 *           type: boolean
 *         description: >
 *           Filtre pour ne retourner que les décisions présentant un intérêt particulier.
 *           Par défaut, retourne toutes les décisions.
 *       - in: query
 *         name: keys
 *         required: false
 *         schema:
 *           type: string
 *         description: >
 *           Nom des variables utilisées pour agréger les données, séparées par des virgules
 *           (ex: `jurisdiction,chamber`). Valeurs possibles : `year`, `month`, `jurisdiction`,
 *           `source`, `location`, `theme`, `formation`, `chamber`, `solution`, `type`, `publication`.
 *           Par défaut, les données ne sont pas agrégées.
 *     responses:
 *       200:
 *         description: Requête effectuée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               requestPerDay: 2500
 *               requestPerWeek: 17500
 *               requestPerMonth: 520000
 *               oldestDecision: "1856-07-27"
 *               newestDecision: "2021-04-15"
 *               indexedTotal: 2250000
 *               indexedByJurisdiction:
 *                 - value: 1500000
 *                   label: "Cour de cassation"
 *                 - value: 135000
 *                   label: "Cour d'appel de Paris"
 *               indexedByYear:
 *                 - value: 250000
 *                   label: "2019"
 *                 - value: 195000
 *                   label: "2018"
 *       400:
 *         description: Requête invalide.
 *       500:
 *         description: Erreur indéfinie côté serveur.
 */