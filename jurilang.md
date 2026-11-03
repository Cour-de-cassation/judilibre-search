Le langage de requête de la Cour dans la recherche textuelle.

### Définition du langage:

On sépare trois types de tokens (mots ou thermes)
- Les thermes de recherche
- Les opérateurs de recherches
- Caractères de priorité des opérateurs

**Thermes de recherche**
- Un therme de recherche peut être constitué d'un ou de plusieurs mots. 
- Un therme de recherche se distingue par des guillemets. Ainsi on peut chercher "loi" ou "prestation compensatoire".
- La syntaxe autorise de rendre les guillemets implicite lorsqu'un therme n'est constitué que d'un mot.
- Il y a au moins un caractère d'espacement qui sert à distinguer un therme de recherche d'un autre élément.

**Opérateurs de recherche**
- Il existe 4 opérateurs logiques de requêtes. Les opérateurs de requêtes exprime le lien logique qui unit deux thermes de recherches, ils sont obligatoires mais la syntaxe autorise de rendre le OU implicite entre deux thermes de recherches.
- La syntaxe des opérateurs de recherches est stricte:
    - ET :  Le therme (ou la sous requête) précédent et le therme (ou la sous requête) suivant doivent toutes deux être présents dans le texte pour que celui ci soit trouvé par la recherche.
    - SAUF :  Le therme (ou la sous requête) précédent doit être présent mais pas le therme (ou la sous requête) suivant pour que le texte soit trouvé par la recherche.
    - OU : Au moins l'un des deux thermes (ou sous requête) suivant et précédent le OU doit être présent pour que le texte soit trouvé par la recherche.
    - PROX/* : * doit être un nombre allant de 1 à 10 inclus. A la différence des autres opérateurs, PROX ne s'applique pas aux sous requête. Pour qu'un texte soit trouvé par la recherche, il doit contenir les deux thermes, précédent et suivant le PROX, séparé par un maximum de tokens défini par le nombre présent dans l'opérateur.

**Caractères de priorité des opérateurs**
- Les parenthèses servent à marquer les priorités dans les requêtes disposant de plusieurs opérateurs.
- L'opération à l'intérieur des parenthèses doit être résolue avant l'opération en dehors, on parle alors de sous-requête. 
- On distingue ainsi `("aa" ET "bb") OU "cc"` (un texte doit contenir soit "aa" et "bb" ensemble, soit "cc") de `"aa" ET ("bb" OU "cc")` (un texte doit contenir "aa" et "bb" ensemble ou alors "aa" et "cc" ensemble).
- La syntaxe autorise les priorités implicites, auquel cas:
    - Une opération PROX, qui ne peut s'appliquer à des sous requêtes, obtient toujours la priorité de résolution absolue.
    - Une opération ET a la même priorité qu'une opération SAUF (qui est en fait une négation de ET), elle se résout avant OU mais après PROX.
    - Une opération OU se résout après que toute les autres aient été résolu.

### Quelques exemple des règles implicites évoquées

- aa bb "cc dd" => "aa" OU "bb" OU "cc dd"
- aa ET bb OU cc PROX/3 dd ET ee => ("aa" ET "bb") OU (("cc" PROX/3 "dd") ET "ee")


