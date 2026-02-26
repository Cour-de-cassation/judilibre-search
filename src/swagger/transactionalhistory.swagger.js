/**
 * @swagger
 * /transactionalhistory:
 *   get:
 *     summary: Permet de consulter les actions de publication effectuées sur la base de données.
 *     tags:
 *       - Export
 *     description: >
 *       Destiné aux utilisateurs désirant procéder à leur propre indexation et mise à disposition
 *       du contenu, ce point d'entrée permet de consulter les opérations effectuées sur la base de
 *       données Judilibre (create, update, delete) afin d'identifier les opérations de synchronisation
 *       à effectuer pour rester à jour. Les opérations sont triées par date ascendante. Lorsque le
 *       nombre d'opérations dépasse la taille allouée, la réponse renvoie une querystring valable
 *       pendant une minute pour consulter la suite des opérations.
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: >
 *           Toutes les opérations remontées auront été effectuées en aval de cette date,
 *           au format ISO-8601 (ex: 2021-05-13T06:00:00Z).
 *       - in: query
 *         name: page_size
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 10
 *           maximum: 500
 *         description: >
 *           Permet de personnaliser le nombre d'opérations obtenu par requête (10 minimum, 500 maximum).
 *           Par défaut, l'application remonte 500 opérations.
 *       - in: query
 *         name: from_id
 *         required: false
 *         schema:
 *           type: string
 *         description: >
 *           Permet d'obtenir les opérations qui suivent cet ID. Il est conseillé d'utiliser
 *           directement la querystring disponible en réponse via `next_page`.
 *     responses:
 *       200:
 *         description: Recherche effectuée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               total: 834
 *               page_size: 10
 *               query_date: "2025-01-31T08:10:18.262Z"
 *               next_page: "date=2021-05-13T06%3A00%3A00Z&page_size=10&from_id=1736952610185%269"
 *               transactions:
 *                 - id: "673ded6e5559d27e30e40f67"
 *                   action: "created"
 *                   date: "2025-01-15T14:50:10.185Z"
 *                 - id: "673ded6e5559d27e30e40f69"
 *                   action: "created"
 *                   date: "2025-01-15T14:50:10.185Z"
 *       400:
 *         description: Requête invalide.
 *       500:
 *         description: Erreur indéfinie côté serveur.
 */