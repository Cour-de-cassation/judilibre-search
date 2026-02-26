/**
 * @swagger
 * /scan:
 *   get:
 *     summary: Permet d'effectuer un export par lot de décisions de justice.
 *     tags:
 *       - Export
 *     description: >
 *       Destiné aux utilisateurs désirant procéder à leur propre indexation et mise à disposition
 *       du contenu, ce point d'entrée leur permet de récupérer des lots de décisions complètes
 *       suivant des paramètres et critères simples.
 *       L'export par lots est limité par défaut (pour une connexion non authentifiée) à 10 résultats
 *       par lot, pour un maximum de 1000 résultats au total.
 *     parameters:
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: >
 *           Filtre les résultats suivant la nature des décisions (parmi les valeurs : `arret`, `qpc`,
 *           `ordonnance`, `saisie`, etc. - les valeurs disponibles sont accessibles via `GET /taxonomy?id=type`).
 *       - in: query
 *         name: theme
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: >
 *           Filtre les résultats suivant la matière relative aux décisions
 *           (les valeurs disponibles sont accessibles via `GET /taxonomy?id=theme`).
 *       - in: query
 *         name: chamber
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: >
 *           Filtre les résultats suivant la chambre relative aux décisions
 *           (les valeurs disponibles sont accessibles via `GET /taxonomy?id=chamber`).
 *       - in: query
 *         name: formation
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: >
 *           Filtre les résultats suivant la formation relative aux décisions
 *           (les valeurs disponibles sont accessibles via `GET /taxonomy?id=formation`).
 *       - in: query
 *         name: jurisdiction
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: >
 *           Filtre les résultats suivant la juridiction relative aux décisions
 *           (les valeurs disponibles sont accessibles via `GET /taxonomy?id=jurisdiction`).
 *       - in: query
 *         name: source
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: >
 *           Filtre les résultats suivant la source des décisions
 *           (les valeurs disponibles sont accessibles via `GET /taxonomy?id=source`).
 *       - in: query
 *         name: location
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: >
 *           Filtre les résultats suivant le code du siège de juridiction
 *           (les valeurs disponibles sont accessibles via `GET /taxonomy?id=location&context_value=ca`
 *           pour les cours d'appel et `GET /taxonomy?id=location&context_value=tj` pour les tribunaux judiciaires).
 *       - in: query
 *         name: publication
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: >
 *           Filtre les résultats suivant le niveau de publication des décisions
 *           (les valeurs disponibles sont accessibles via `GET /taxonomy?id=publication`).
 *       - in: query
 *         name: solution
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: >
 *           Filtre les résultats suivant le type de solution des décisions
 *           (les valeurs disponibles sont accessibles via `GET /taxonomy?id=solution`).
 *       - in: query
 *         name: date_start
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: >
 *           Combiné avec le paramètre `date_end`, permet de restreindre les résultats à un intervalle
 *           de dates, au format ISO-8601 (par exemple 2021-05-13, 2021-05-13T06:00:00Z).
 *       - in: query
 *         name: date_end
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: >
 *           Combiné avec le paramètre `date_start`, permet de restreindre les résultats à un intervalle
 *           de dates, au format ISO-8601 (par exemple 2021-05-13, 2021-05-13T06:00:00Z).
 *       - in: query
 *         name: date_type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [creation, update]
 *         description: Type de date à prendre en compte pour l'intervalle de dates fourni pour l'export.
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: >
 *           Permet de choisir l'ordre du tri des décisions exportées (`asc` pour un tri chronologique
 *           ou `desc` pour un tri antichronologique, vaut `asc` par défaut).
 *       - in: query
 *         name: batch_size
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *         description: Permet de déterminer le nombre de résultats retournés par lot (1000 maximum, vaut 10 par défaut).
 *       - in: query
 *         name: searchAfter
 *         required: false
 *         schema:
 *           type: string
 *         description: >
 *           L'ID de la décision à partir de laquelle chercher le prochain batch de résultats
 *           (fourni par la réponse de la requête précédente via `next_batch`).
 *       - in: query
 *         name: abridged
 *         required: false
 *         schema:
 *           type: boolean
 *         description: >
 *           Lorsque ce paramètre vaut `true`, le résultat de la requête contiendra la version abrégée
 *           des décisions (sans texte intégral ni métadonnées détaillées, vaut `false` par défaut).
 *       - in: query
 *         name: resolve_references
 *         required: false
 *         schema:
 *           type: boolean
 *         description: >
 *           Lorsque ce paramètre vaut `true`, le résultat de la requête contiendra, pour chaque
 *           information retournée par défaut sous forme de clé, l'intitulé complet de celle-ci
 *           (vaut `false` par défaut).
 *       - in: query
 *         name: withFileOfType
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [prep_rapp, prep_avis, prep_oral, comm_comm, comm_note, comm_nora, comm_lett, comm_trad]
 *         description: >
 *           Filtre les résultats suivant le type de documents associés aux décisions.
 *           Les valeurs disponibles sont accessibles via `GET /taxonomy?id=filetype`.
 *       - in: query
 *         name: particularInterest
 *         required: false
 *         schema:
 *           type: boolean
 *         description: >
 *           Lorsque ce paramètre vaut `true`, le résultat de la requête sera restreint aux décisions
 *           qualifiées comme présentant un intérêt particulier (vaut `false` par défaut).
 *     responses:
 *       200:
 *         description: Export effectué avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               batch_size: 10
 *               total: 341
 *               next_batch: "...&search_after=0%261729555200000%26673ded6f5559d27e30e40fc5"
 *               took: 42
 *               query:
 *                 type: [arret, qpc]
 *                 publication: [c, b]
 *                 date_start: "1970-01-01"
 *                 date_end: "2021-01-01"
 *                 order: desc
 *                 batch_size: 10
 *                 resolve_references: false
 *               results:
 *                 - id: "5fca7d162a251e6bf9c78514"
 *                   jurisdiction: "cc"
 *                   chamber: "civ3"
 *                   number: "17-18.194"
 *                   numbers: ["17-18.194", "16-21.165"]
 *                   ecli: "ECLI:FR:CCASS:2018:C301117"
 *                   formation: "fs"
 *                   publication: [c, b]
 *                   decision_date: "2018-12-20"
 *                   type: "arret"
 *                   solution: "rejet"
 *                   summary: "Le titulaire d'une autorisation temporaire d'occupation..."
 *                   themes:
 *                     - "Expropriation pour cause d'utilité publique"
 *                     - "Indemnité"
 *                   text: "CIV.3 \r\nCH.B\r\n..."
 *       400:
 *         description: Requête invalide.
 *       500:
 *         description: Erreur indéfinie côté serveur.
 */