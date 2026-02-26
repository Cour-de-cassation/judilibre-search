/**
 * @swagger
 * /taxonomy:
 *   get:
 *     security:
 *       - access: []
 *     summary: Permet de récupérer les listes des termes employés par le processus de recherche.
 *     tags:
 *       - Taxonomie
 *     description: >
 *       Ce point d'entrée permet de récupérer les listes des termes (sous la forme d'un couple
 *       clé/valeur) constituant les différents critères et filtres pris en compte par le processus
 *       de recherche, notamment : types de décision, juridictions, chambres, formations, niveaux de
 *       publication, matières, solutions, champs et zones de contenu, etc.
 *       Sans paramètre, retourne la liste de toutes les entrées de taxonomie disponibles.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         schema:
 *           type: string
 *         description: >
 *           Identifiant de l'entrée de taxonomie à interroger (`type`, `jurisdiction`, `chamber`, etc.
 *           - les valeurs disponibles sont accessibles via `GET /taxonomy` sans paramètre).
 *       - in: query
 *         name: key
 *         required: false
 *         schema:
 *           type: string
 *         description: >
 *           Clé du terme dont on veut récupérer l'intitulé complet (le paramètre `id` est alors requis).
 *           Par exemple : `GET /taxonomy?id=jurisdiction&key=cc` retournera `Cour de cassation`.
 *       - in: query
 *         name: value
 *         required: false
 *         schema:
 *           type: string
 *         description: >
 *           Intitulé complet du terme dont on veut récupérer la clé (le paramètre `id` est alors requis).
 *           Par exemple : `GET /taxonomy?id=jurisdiction&value=cour%20de%20cassation` retournera `cc`.
 *       - in: query
 *         name: context_value
 *         required: false
 *         schema:
 *           type: string
 *           enum: [cc, ca, tj, tcom]
 *         description: >
 *           Valeur pouvant être requise pour contextualiser certaines listes (par exemple,
 *           `GET /taxonomy?id=chamber&context_value=cc` pour obtenir les chambres de la Cour de cassation).
 *           Si omis, la valeur `cc` est utilisée par défaut.
 *     responses:
 *       200:
 *         description: Requête effectuée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               result: ["cc", "ca"]
 *       400:
 *         description: Requête invalide.
 *       404:
 *         description: Terme non trouvé.
 *       500:
 *         description: Erreur indéfinie côté serveur.
 */