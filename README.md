# judilibre-search
API de recherche et de consultation de la plateforme JUDILIBRE.

## Tests de l'API via Docker

1. `docker pull opendatajustice/judilibre-search:master` ;
2. `docker run --env WITHOUT_ELASTIC=true -p 80:8080/tcp opendatajustice/judilibre-search:master` ;
3. L'API publique (entrées `/search`, `/decision` et `/taxonomy`, cf. [spécifications au format OpenAPI 3.0.2](src/data/JUDILIBRE-public.json)) est accessible via `http://localhost:80` sur un jeu statique de données publiques pseudonymisées.