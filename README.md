## L'API Judilibre

_La documentation présente est disponibles sur le [Github du code source de l'API Judilibre](https://github.com/Cour-de-cassation/judilibre-search)_

L'API Judilibre assure la publication des décisions rendues publiquement par la Cour de cassation, enrichies et pseudonymisées.

Au fur et à mesure du calendrier établi par l’arrêté du 28 avril 2021 s’ajouteront les décisions rendues par d’autres juridictions de l’ordre judiciaire, telles les décisions civiles, sociales et commerciales des cours d’appel (mars 2022).

L’API Judilibre, mise à disposition via [le portail PISTE](https://developer.aife.economie.gouv.fr/) et accessible gratuitement après inscription, permet notamment de rechercher en plein texte ou suivant des critères spécifiques parmi l’ensemble de ces décisions.

Les données disponibles via l'API sont celles de la version du site de la Cour de cassation (https://courdecassation.fr/recherche-judilibre).

Cette version de l'API est une version bêta. Elle permet de recueillir vos remarques et vos suggestions d’amélioration. Elle est donc suceptible d'évoluer les prochains mois.

## Conditions d'utilisation

L'utilisation de ces données est soumise :

- à la licence ouverte 2.0 ;
- aux [conditions générales d'utilisation de PISTE](https://developer.aife.economie.gouv.fr/images/com_apiportal/CGU/cgu_portal_FR.pdf) ;
- aux [conditions générales d'utilisation pour la réutilisation des données issues des décisions de justice de l'ordre judiciaire diffusées en opendata par la Cour de cassation](https://www.courdecassation.fr/conditions-generales-dutilisation-pour-la-reutilisation-des-donnees-issues-des-decisions-de-justice) ;
- à des quotas qui seront prochainement sur le portail PISTE.

## Premiers pas sur Piste et sur l'API

### L'accès piste : 4 étapes

- [Créez votre compte](https://piste.gouv.fr/component/apiportal/registration), activez le compte (lien mail) et connectez-vous
- [Validez les CGU](https://piste.gouv.fr/api-fr/consentement-cgu-api-fr) - en cherchant "Judilibre" a minima pour l'environnement sandbox et/ou celui de production
- [Raccorder votre Sandbox](https://piste.gouv.fr/apps)
  - cliquez sur votre Application Sandbox (nommée généralement "APP*SANDBOX*
    %VOTRE_EMAIL%")
  - cliquez sur "Modifier l'application"
  - et en bas, dans la liste des APIs, cochez l'API Judilibre (Sandbox)
  - cliquez sur "Appliquer les modifications"

### API Endpoints

La documentation technique sur chaque méthode de l'API est disponible sur le portail [api.gouv.fr (OpenAPI 3.0.2)](https://staging.api.gouv.fr/documentation/api-judilibre) [PISTE (Swagger)](https://piste.gouv.fr/index.php?option=com_apiportal&view=apitester&usage=api&apitab=tests&apiName=JUDILIBRE&apiId=b6d2f389-c3ec-4eb3-9075-bc24d0783781&managerId=2&type=rest&apiVersion=1.0.0&Itemid=402&swaggerVersion=2.0&lang=fr) ou sur le [Github](https://github.com/Cour-de-cassation/judilibre-search/blob/master/public/JUDILIBRE-public-swagger.json).

Les endpoints racine sont disponibles pour deux environnement (nécessitent donc l'enrôlement préalable et l'obtention d'un `KeyId`) :

- bac à sable: https://sandbox-api.piste.gouv.fr/cassation/judilibre/v1.0
- production: https://api.piste.gouv.fr/cassation/judilibre/v1.0

**Note** : ces URLs ne sont pas directement accessibles via une navigation classique et nécessitent _a minima_ la spécification de votre `KeyId` dans l'en-tête des requêtes (voir ci-après).

### Tester l'API

Pour les plus rapides, vous avez identifié que votre `KeyId` dans votre APP_SANDBOX, vous pouvez forger vous-même vos requêtes :

```
curl -is -H "accept: application/json" -H "KeyId: %keyId%" -X GET "https://sandbox-api.piste.gouv.fr/cassation/judilibre/v1.0/search?query=brevet"

{"page":0,"page_size":10,"query":{"query":"brevet","field":[],"type":[],"theme":[],"chamber":[],"formation":[],"jurisdiction":[],"publication":[],"solution":[]},"total":2025,"previous_page":null,"next_page":"query=brevet&field=&type=&theme=&chamber=&formation=&jurisdiction=&publication=&solution=&page=1","took":25,"max_score":2934.1016,"results":[{"score":1,"highlights":{"text":["européen et d'un <em>brevet</em> français se résout par la substitution du <em>brevet</em>...}
```

Ou par navigation :

- [Accéder à l'API](https://piste.gouv.fr/api-fr/api-center)
  - chercher "Judilibre"
  - cliquez sur "Tester l'API"
  - choisissez dans "Select credentials" la premier clé de votre application Sandbox (APP_SANDBOX...)
- Tester alors le point d'API `/search`
  - cliquez sur `/search`
  - cliquez sur "Try it out"
  - saisissez votre recherche (e.g "brevet" pour cherchez les juridsprudences sur les brevets
  - cliquez sur "Execute"

Vous verrez apparaître le JSON de réponse dans l'encadré juste après.

## Exploitation du zonage

Le zonage désigne les informations permettant de découper le texte des décisions en sections identifiées (cf. `/taxonomy?id=field`) :

- `introduction`: Introduction
- `expose`: Exposé du litige
- `moyens`: Moyens
- `motivations`: Motivations
- `dispositif`: Dispositif
- `annexes`: Moyens annexés

Le zonage est défini par un objet `zones` disponible dans le retour des API `/decision` et `/export` et qui se présente comme suit :

```json
{
  "zones": {
    "introduction": [
      {
        "start": 0,
        "end": 1649
      }
    ],
    "expose": [
      {
        "start": 1649,
        "end": 2204
      }
    ],
    "moyens": [
      {
        "start": 2204,
        "end": 4753
      }
    ],
    "motivations": [
      {
        "start": 4753,
        "end": 7543
      }
    ],
    "dispositif": [
      {
        "start": 7543,
        "end": 7924
      }
    ],
    "annexes": [
      {
        "start": 7924,
        "end": 45372
      }
    ]
  }
}
```

Chaque zone contient une liste de fragments, dont les items `start` et `end` contiennent respectivement l'indice de début (inclus) et de fin (exclu) du fragment correspondant dans le texte intégral (propriété `text`).

**Attention :** chaque zone peut contenir plusieurs fragments et ceux-ci ne sont pas forcément séquentiels ! Autrement dit : il peut y avoir dans la zone `moyens` des fragments qui se situent, dans le texte, _après_ certains fragments définis dans la zone `motivations` !

Afin de faciliter le traitement et l'affichage des zones côté _front_, il est recommandé de procéder à leur linéarisation préalable, comme suit (exemple en javascript) :

```javascript
const text = result.text;
const zones = result.zones;

const orderedZones = [];
for (let zone in zones) {
  zones[zone].forEach((fragment) => {
    orderedZones.push({
      zone: zone,
      start: fragment.start,
      end: fragment.end,
    });
  });
}
orderedZones.sort((a, b) => {
  if (a.start < b.start) {
    return -1;
  }
  if (a.start > b.start) {
    return 1;
  }
  return 0;
});

// La liste orderedZones contient désormais les zones ordonnées séquentiellement :
orderedZones.forEach((zone) => {
  const textFragment = text.substring(zone.start, zone.end);
  console.log(`Zone: ${zone.zone}`);
  console.log(`Fragment: ${textFragment}`);
});
```

## Exploitation de l'historique de transaction

Le endpoint `/transactionalhistory` fourni un moyen de suivre les actions d'écritures effectuées sur la base de donnée des décisions (création de décision, mise à jour ou suppression). Ce [transaction log](https://en.wikipedia.org/wiki/Transaction_log) doit permettre aux utilisateurs qui souhaitent maintenir leur propre base de donnée de se synchroniser plus facilement avec l'état courant.

Vous pouvez consulter ici des exemples d'utilisations: [/documentation/transactionalhistory](/documentation/transactionalhistory).

## Tests de l'API via Docker

### Dépendances

L'application nécessite node et peut fonctionner avec une base de donnée elasticsearch, n'hésitez pas à jeter un coup d'oeil à [juridependencies](https://github.com/Cour-de-cassation/juridependencies).

### Commandes

Vous pouvez simplement utiliser `npm run start:docker` si vous disposez d'une base elastic.

Vous pouvez tester avec une version mocké d'elastic sur:

```
docker run --env WITHOUT_ELASTIC=true -p 80:8080/tcp opendatajustice/judilibre-search:master
```

Des données statiques, destinées aux tests fonctionnels de base, sont inclues :

- Un ensemble représentatif de résultats paginés en retour du point d'entrée `/search` (ne contient que des fragments de décisions) ;
- Une [décision détaillée](https://www.legifrance.gouv.fr/juri/id/JURITEXT000042619658?tab_selection=all&searchField=ALL&query=19-60.222&searchType=ALL&typePagination=DEFAULT&pageSize=10&page=1&tab_selection=all) (d'autres seront ajoutées plus tard) en retour du point d'entrée `/decision` ;
- Les termes auxquels correspondent certaines métadonnées en retour du point d'entrée `/taxonomy` (en cours de complétion).
