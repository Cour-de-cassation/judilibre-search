/**
 * @swagger
 * /search:
 *   get:
 *     security:
 *       - access: []
 *     summary: Permet d'effectuer une recherche dans les données ouvertes des décisions de justice.
 *     tags:
 *       - Recherche
 *     description: >
 *       Le point d'entrée `GET /search` permet d'effectuer une recherche dans la base de données
 *       ouverte des décisions de justice, suivant les paramètres, filtres et critères suivants :
 *       texte en saisie libre, mode de mise en rapport des termes, contenu ciblé, nature de décision,
 *       matière, chambre, formation, juridiction, niveau de publication, type de solution, intervalle
 *       de dates, pertinence et date, pagination.
 *       Le résultat est nécessairement paginé (50 résultats maximum par page, 10 000 au total) et ne
 *       contient qu'un aperçu des décisions. Le texte intégral est accessible via `GET /decision`.
 *     parameters:
 *       - in: query
 *         name: query
 *         required: false
 *         schema:
 *           type: string
 *           maxLength: 512
 *         description: >
 *           Chaîne de caractères correspondant à la recherche. Une recherche avec un paramètre
 *           `query` vide ou manquant est ignorée et retourne un résultat vide.
 *       - in: query
 *         name: field
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: >
 *           Liste des champs ciblés par la recherche (`expose`, `moyens`, `motivations`, `dispositif`,
 *           `annexes`, `sommaire`, `titrage`, etc. - les valeurs disponibles sont accessibles via
 *           `GET /taxonomy?id=field`). Si vide ou manquant, la recherche s'applique à l'intégralité
 *           de la décision mais exclut les métadonnées.
 *       - in: query
 *         name: operator
 *         required: false
 *         schema:
 *           type: string
 *           enum: [or, and, exact]
 *         description: >
 *           Opérateur logique reliant les multiples termes que le paramètre `query` peut contenir
 *           (`or` par défaut, `and` ou `exact`).
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: >
 *           Filtre les résultats suivant la nature des décisions (`arret`, `qpc`, `ordonnance`, etc.
 *           - les valeurs disponibles sont accessibles via `GET /taxonomy?id=type`).
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
 *           Par exemple : `GET /search?...&location=tj33063`.
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
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *           enum: [score, scorepub, date]
 *         description: >
 *           Permet de choisir la valeur suivant laquelle les résultats sont triés (`score` pour un tri
 *           par pertinence, `scorepub` pour un tri par pertinence et niveau de publication, `date` pour
 *           un tri par date, vaut `scorepub` par défaut).
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: >
 *           Permet de choisir l'ordre du tri (`asc` pour un tri ascendant ou `desc` pour un tri
 *           descendant, vaut `desc` par défaut).
 *       - in: query
 *         name: page_size
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Permet de déterminer le nombre de résultats retournés par page (50 maximum, vaut 10 par défaut).
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Permet de déterminer le numéro de la page de résultats à retourner (la première page valant `0`).
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
 *         description: Recherche effectuée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               page: 0
 *               page_size: 10
 *               total: 341
 *               next_page: "http://.../...&page=1"
 *               took: 14
 *               max_score: 2428.1362
 *               relaxed: false
 *               query:
 *                 query: "expropriation"
 *                 field: [expose, moyens, motivations]
 *                 operator: or
 *                 type: [arret, qpc]
 *                 publication: [c, b]
 *                 date_start: "1970-01-01"
 *                 date_end: "2021-01-01"
 *                 sort: score
 *                 order: desc
 *                 page_size: 10
 *                 page: 0
 *                 resolve_references: false
 *               results:
 *                 - score: 0.6848325044168517
 *                   id: "5fca7d162a251e6bf9c78514"
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
 *                   highlights:
 *                     motivations:
 *                       - "...fixe les indemnités revenant à la suite de <em>l'expropriation</em>"
 *       400:
 *         description: Requête invalide.
 *       416:
 *         description: La plage d'informations demandée est incorrecte ou ne peut pas être satisfaite.
 *       500:
 *         description: Erreur indéfinie côté serveur.
 */