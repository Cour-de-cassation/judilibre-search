## version 1.2.4 (02/2024)

* Ajout de la propriété `particularInterest` : 
    * Dans les résultats : lorsque la propriété `particularInterest` est définie et vaut `true`, alors la décision correspondante est qualifiée comme présentant un intérêt particulier ;
    * Comme paramètre d'extraction par lot (`/export`) et de recherche (`/search`) : lorsque le paramètre `particularInterest` vaut `true`, le résultat de la requête sera restreint aux décisions qualifiées comme présentant un intérêt particulier (vaut `false` par défaut).

## version 1.2.3 (09/2023)

* Ajout des décisions des tribunaux judiciaires :
    * Nouvelle valeur `tj` pour le paramètre `jurisdiction` (routes `/taxonomy`, `/export`, `/search` et `/stats`).