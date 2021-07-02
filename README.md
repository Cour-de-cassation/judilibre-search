# judilibre-search

API de recherche et de consultation de la plateforme JUDILIBRE.

## Tests de l'API via Docker

1. `docker run --env WITHOUT_ELASTIC=true -p 80:8080/tcp opendatajustice/judilibre-search:master` ;
2. L'API publique (entrées `/search`, `/decision` et `/taxonomy`, cf. spécifications [au format OpenAPI 3.0.2](public/JUDILIBRE-public.json) ou [au format Swagger 2.0](public/JUDILIBRE-public-swagger.json)) est accessible via `http://localhost:80` sur un jeu statique de données publiques pseudonymisées (accessibles par ailleurs via le site www.legifrance.gouv.fr).

Les données statiques, destinées aux tests fonctionnels de base, sont :

- Un ensemble représentatif de résultats paginés en retour du point d'entrée `/search` (ne contient que des fragments de décisions) ;
- Une [décision détaillée](https://www.legifrance.gouv.fr/juri/id/JURITEXT000042619658?tab_selection=all&searchField=ALL&query=19-60.222&searchType=ALL&typePagination=DEFAULT&pageSize=10&page=1&tab_selection=all) (d'autres seront ajoutées plus tard) en retour du point d'entrée `/decision` ;
- Les termes auxquels correspondent certaines métadonnées en retour du point d'entrée `/taxonomy` (en cours de complétion).

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
