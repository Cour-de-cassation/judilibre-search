# judilibre-search
API de recherche et de consultation de la plateforme JUDILIBRE.

## Tests de l'API via Docker

1. `docker pull opendatajustice/judilibre-search:master` ;
2. `docker run --env WITHOUT_ELASTIC=true -p 80:8080/tcp opendatajustice/judilibre-search:master` ;
3. L'API publique (entrées `/search`, `/decision` et `/taxonomy`, cf. [spécifications au format OpenAPI 3.0.2](src/data/JUDILIBRE-public.json)) est accessible via `http://localhost:80` sur un jeu statique de données publiques pseudonymisées (accessibles par ailleurs via le site www.legifrance.gouv.fr).

Les données statiques, destinées aux tests fonctionnels de base, sont :
* Un ensemble représentatif de 1000+ résultats paginés en retour du point d'entrée `/search` (ne contient que des fragments de décisions) ;
* Une [décision détaillée](https://www.legifrance.gouv.fr/juri/id/JURITEXT000042619658?tab_selection=all&searchField=ALL&query=19-60.222&searchType=ALL&typePagination=DEFAULT&pageSize=10&page=1&tab_selection=all) (d'autres seront ajoutées plus tard) en retour du point d'entrée `/decision` ;
* Les termes auxquels correspondent certaines métadonnées en retour du point d'entrée `/taxonomy` (en cours de complétion).
