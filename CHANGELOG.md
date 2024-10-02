# Changelog

Notes : 

* Certains changements de version ont eu pour seul objectif de forcer le déclenchement du déploiement automatisé de l'application sur l'ancienne plateforme d'hébergement. Ils ne concernent donc aucune évolution fonctionnelle réelle.

## version 1.2.4 (02/2024)

* Ajout de la propriété `particularInterest` : 
    * Dans les résultats : lorsque la propriété `particularInterest` est définie et vaut `true`, alors la décision correspondante est qualifiée comme présentant un intérêt particulier ;
    * Comme paramètre d'extraction par lot (`/export`) et de recherche (`/search`) : lorsque le paramètre `particularInterest` vaut `true`, le résultat de la requête sera restreint aux décisions qualifiées comme présentant un intérêt particulier (vaut `false` par défaut).

## version 1.2.3 (09/2023)

* Ajout des décisions des tribunaux judiciaires :
    * Nouvelle valeur `tj` pour le paramètre `jurisdiction` (routes `/taxonomy`, `/export`, `/search` et `/stats`).

## version 1.2.2 (03/2023)

* Nettoyage et révision de la documentation.

## version 1.2.1 (12/2022)

* "Bump" forcé.

## version 1.2.0 (09/2022)

* Ajout des propriétés `decision_datetime`, `update_datetime` et `legacy`, intégration des décisions des cours d'appel.

## version 1.1.0 (04/2022)

* Nettoyage et révision de la documentation, notamment pour l'évolutions du chaînage an amont de l'introduction des décisions des cours d'appel.

## version 1.0.3 (08/2021)

* Ajout des fichiers joints aux décisions de la Cour de cassation (propriété `files` et nouveau filtre `withFileOfType`).

## version 1.0.2 (06/2021)

* Ajout de la version Swagger 2.0.

## version 1.0.1 (06/2021)

* Première version publiée (OpenAPI 3.0.2).