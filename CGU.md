**CONDITIONS GENERALES D'UTILISATION**

**POUR LA REUTILISATION DES DONNEES ISSUES DES DECISIONS DE JUSTICE DE
L'ORDRE JUDICIAIRE DIFFUSEES EN OPEN DATA PAR LA COUR DE CASSATION**

**SOMMAIRE**

 {#section .list-paragraph .TOC-Heading}

[I. DEFINITIONS 2](#definitions)

[II. OBJET ET CHAMP D'APPLICATION 2](#objet-et-champ-dapplication)

[A. Contexte et objet 2](#contexte-et-objet)

[B. Champ d'application 3](#champ-dapplication)

[C. Acceptation des CGU 3](#acceptation-des-cgu)

[III. MENTIONS LEGALES 4](#mentions-legales)

[IV. MISE A JOUR DES DONNEES 4](#mise-a-jour-des-donnees)

[V. ETENDUE DU DROIT A REUTILISATION ET CONDITIONS D'EXERCICE
4](#etendue-du-droit-a-reutilisation-et-conditions-dexercice)

[VI. INTERDICTION DU PROFILAGE 5](#interdiction-du-profilage)

[VII. PROTECTION DES DONNEES A CARACTERE PERSONNEL
6](#protection-des-donnees-a-caractere-personnel)

[VIII. EXERCICE DES DROITS D'ACCES ET DE RECTIFICATION (RGPD)
6](#exercice-des-droits-dacces-et-de-rectification-rgpd)

[IX. CORRECTION DU DEFAUT D'OCCULTATION DES NOMS ET PRENOMS DES
PERSONNES PHYSIQUES MENTIONNEES DANS LES DECISIONS DE JUSTICE
7](#correction-du-defaut-doccultation-des-noms-et-prenoms-des-personnes-physiques-mentionnees-dans-les-decisions-de-justice)

[X. TRAITEMENT DES DEMANDES D'OCCULTATION OU DE LEVEE D'OCCULTATION
(ARTICLE R.111-13 du COJ)
7](#traitement-des-demandes-doccultation-ou-de-levee-doccultation-article-r.111-13-du-coj)

[XI. CLAUSES PARTICULIERES RELATIVES A L'API
8](#clauses-particulieres-relatives-a-lapi)

[A. Description de l'API Judilibre 8](#description-de-lapi-judilibre)

[B. Mise à disposition de l'API Judilibre
8](#mise-à-disposition-de-lapi-judilibre)

[C. Conditions d'accès à PISTE et à l'API Judilibre
8](#conditions-daccès-à-piste-et-à-lapi-judilibre)

[D. Engagements de l'API Judilibre 9](#engagements-de-lapi-judilibre)

[E. Engagements des utilisateurs 10](#engagements-des-utilisateurs)

[XII. RESPONSABILITE 11](#responsabilite)

[XIII. PROPRIETE INTELLECTUELLE 12](#propriete-intellectuelle)

[XIV. LITIGE / DROIT APPLICABLE 12](#litige-droit-applicable)

**\
**

DEFINITIONS
===========

**« API »** (Application Programming Interface ou interface de
programmation applicative) : interface de programmation applicative
comprenant un ensemble de méthodes, fonctions et classes, mise à
disposition par l'intermédiaire d'une interface dont le but est d'offrir
des services à d\'autres logiciels.

**« Base Open Data »** : base de données alimentée par les décisions
pseudonymisées rendues publiquement par la Cour de cassation et par les
chambres civiles, commerciales et sociales des cours d'appel.

**« Cour de cassation »** : partie concédant un droit non exclusif et
gratuit de réutilisation des données contenues dans la base Open Data
dans les conditions prévues par les présentes conditions générales
d'utilisation ainsi que par la licence ouverte de réutilisation
d'informations publiques version 2.0.

**« Licence »** : contrat définissant les conditions de réutilisation
des données contenues dans la base de données Open data.

**« Réglementation applicable en matière de droit des données
personnelles »** : corpus de dispositions constitué notamment du
Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril
2016, relatif à la protection des personnes physiques à l'égard du
traitement des données à caractère personnel et à la libre circulation
de ces données et de la loi n°78-17 du 6 janvier 1978 relative à
l'informatique, aux fichiers et aux libertés.

**« Réutilisateur »** : toute personne, physique ou morale, qui utilise
les informations contenues dans la base de données Open Data.

**« Réutilisation »** : l'utilisation des données issues de la base Open
Data à d'autres fins que celles pour lesquelles elles ont été produites.
Cette réutilisation est subordonnée à l'acceptation sans réserve de la
licence ouverte de réutilisation d'informations publiques version 2.0 et
des présentes conditions générales d'utilisation par le réutilisateur.

OBJET ET CHAMP D'APPLICATION 
============================

Contexte et objet
-----------------

 {#section-1 .list-paragraph}

L'article R. 111-10 du code de l'organisation judiciaire (COJ) a confié
à la Cour de cassation la responsabilité de la mise à la disposition du
public, sous forme électronique et à titre gratuit, des décisions de
justice rendues par les juridictions judiciaires françaises.

Pour ce faire et afin de satisfaire aux obligations prévues par les
articles L. 111-13 et R. 111-11 à R. 111-13 du COJ, et notamment la
pseudonymisation des décisions avant leur diffusion en open data, il a
été créé un traitement automatisé de données à caractère personnel
dénommé « Judilibre » ayant pour finalité la diffusion éventuellement
enrichie des décisions de justice de l'ordre judiciaire ainsi que la
conservation des données en vue de cette diffusion et du traitement des
demandes d'occultation et de levée d'occultation.

Ce traitement permet à la Cour de cassation de mettre à la disposition
du public, gratuitement, une base de données ouverte alimentée par les
décisions rendues publiquement par la Cour de cassation et par les
chambres civiles, sociales et commerciales des cours d'appel,
éventuellement enrichies, et pseudonymisées (ci-après la base Open
Data).

Cette base permet :

-   La publication des données produites par les juridictions
    judiciaires qui ont vocation à être diffusées en open data après
    leur pseudonymisation,

-   La consultation ou le téléchargement de ces données par tout
    réutilisateur,

-   La réutilisation des données dans le respect du cadre établi par la
    licence ouverte version 2.0 et les présentes conditions générales
    d'utilisation.

Une API permet aux réutilisateurs de télécharger les données contenues
dans la base et d'effectuer des recherches dans la base de données avec
un moteur de recherche intégré à l'API.

La réutilisation de ces données est conditionnée à l'acceptation sans
réserve des termes de la licence ouverte de réutilisation d'informations
publiques version 2.0, complétée par les présentes conditions générales
d'utilisation (ci-après CGU) et, le cas échéant, des conditions
générales d'utilisation de PISTE.

Champ d'application 
-------------------

Les présentes conditions générales d'utilisation ont pour objet de
définir les conditions spécifiquement applicables à la réutilisation des
données fournies par la Cour de cassation, quel que soit le mode
d'accès, et s'appliquent à l'ensemble des réutilisateurs des données.

Acceptation des CGU
-------------------

Pour accepter valablement les présentes CGU, le réutilisateur doit soit
être majeur soit, s'il est mineur, demander au titulaire de l'autorité
parentale ou être autorisé par lui, à accepter les présentes CGU.

Lorsqu'il consulte, utilise, télécharge les données contenues dans la
base de données open data, le réutilisateur, qu'il soit une personne
physique ou une personne morale, accepte les présentes conditions
générales d'utilisation, dont la Cour de cassation se réserve la
modification à tout moment dans le respect de la réglementation en
vigueur. Lesdites modifications prendront effet immédiatement après la
publication des nouvelles conditions générales d'utilisation. Le
réutilisateur doit se tenir informé de toute modification. Les dernières
CGU en vigueur sont accessibles à tout utilisateur et consultables sur
le site de la Cour de cassation et sur le site de PISTE.

L'acceptation des CGU est réalisée matériellement lors de la première
consultation, utilisation ou téléchargement des données.

Pour le téléchargement des données (PISTE), cette acceptation se fait en
deux temps :

-   Lors de l'inscription à la plateforme PISTE, s'agissant des CGU de
    PISTE,

-   Et lors du choix d'utiliser l'API Judilibre dans le catalogue d'API
    offert par PISTE.

L'acceptation des présentes CGU emporte acceptation sans réserve des
termes de la licence ouverte de réutilisation d'informations publiques
version 2.0 (<https://www.etalab.gouv.fr/licence-ouverte-open-licence>)
ainsi que, le cas échéant, des CGU de PISTE
(<https://developer.aife.economie.gouv.fr/images/com_apiportal/CGU/cgu_portal_FR.pdf>).

En cas de contradiction entre les documents listés ci-dessus, les
présentes CGU primeront sur les autres documents.

La Cour de cassation peut être amenée à tout moment à procéder à des
modifications des présentes CGU, en ce compris les clauses particulières
relatives à l'API Judilibre. Les dernières CGU en vigueur sont
consultables sur le site de la Cour de cassation et sur celui de PISTE
et accessibles à tout utilisateur.

MENTIONS LEGALES 
=================

Le responsable de la base de données Open Data, objet des présentes CGU,
est la Cour de cassation.

Pour plus d'information sur la Cour de cassation, veuillez consulter la
page suivante :

<https://www.courdecassation.fr/mentions_legales_9247.html>

MISE A JOUR DES DONNEES
=======================

La Cour de cassation se réserve le droit de modifier, de supprimer ou de
corriger, à tout moment, à sa seule discrétion et sans préavis, toute
donnée contenue dans la base Judilibre.

 {#section-2 .list-paragraph}

ETENDUE DU DROIT A REUTILISATION ET CONDITIONS D'EXERCICE
=========================================================

 {#section-3 .list-paragraph}

L'article L. 111-13 du COJ prévoit que les articles L. 321-1 à L. 326-1
du code des relations entre le public et l\'administration (CRPA) sont
applicables à la réutilisation des informations publiques figurant dans
les décisions rendues par les juridictions judiciaires qui sont mises à
la disposition du public à titre gratuit sous forme électronique.

L'article L. 321-1 du CRPA prévoit que ces informations publiques
*« peuvent être utilisées par toute personne qui le souhaite à d\'autres
fins que celles de la mission de service public pour les besoins de
laquelle les documents ont été produits ou reçus*. »

Ainsi, la licence ouverte version 2.0 indique de façon générale que
« *le « réutilisateur » est libre de réutiliser l'« information » : de
la reproduire, la copier, de l'adapter, la modifier, l'extraire et la
transformer pour créer des « informations dérivées », des produits ou
des services, de la communiquer, la diffuser, la redistribuer, la
publier et la transmettre, de l'exploiter à titre commercial, par
exemple en la combinant avec d'autres informations, ou en l'incluant
dans son propre produit ou application.* ».

Cependant, ces dispositions ne sauraient faire échec à celles prévues
par le CRPA quant à la réutilisation des informations publiques et
notamment à l'article L. 322-1 du CRPA qui précise que *« **sauf accord
de l\'administration, la réutilisation des informations publiques est
soumise à la condition que ces dernières ne soient pas altérées, que
leur sens ne soit pas dénaturé et que leurs sources et la date de leur
dernière mise à jour soient mentionnées**. »*.

Ainsi, le réutilisateur a :

-   **L'interdiction d'altérer les données :**

Le réutilisateur s'engage à ne pas falsifier ni fausser les données et
plus généralement à préserver l'intégrité des données réutilisées.

-   **L'interdiction de dénaturer le sens des données :**

La licence ouverte version 2.0 rappelle à ce titre que « *la
« réutilisation » ne doit pas induire en erreur des tiers quant au
contenu de l'« information », sa source et sa date de mise à jour. ».*

-   **L'obligation de mentionner la source des données :**

Le réutilisateur a l'obligation de mentionner que les données
proviennent de la base de données Open Data tenue par la Cour de
cassation et ce, quel que soit le support de réutilisation.

Le réutilisateur doit en outre mentionner, pour chaque décision de
justice réutilisée, le nom de la juridiction et la formation qui l'a
rendue, son siège et la date de son prononcé.

Il peut renvoyer, par un lien hypertexte, vers la source des données en
assurant une mention effective de sa paternité.

-   **L'obligation de mentionner la date de la dernière mise à jour des
    données :**

Tout réutilisateur a l'obligation de mentionner la date de la dernière
mise à jour des données qu'il réutilise et il a également l'obligation,
en sa qualité de responsable de traitement, de tenir ses données à jour.

Lorsque les données issues de la base Open Data sont réutilisées à des
fins professionnelles et/ou commerciales, la fréquence de mise à jour de
sa base de données par le réutilisateur est fixée à 72 (soixante-douze)
heures maximum.

INTERDICTION DU PROFILAGE
=========================

Le 3^e^ alinéa de l'article L. 111-13 du COJ prévoit que *« les données
d\'identité des magistrats et des membres du greffe ne peuvent faire
l\'objet d\'une réutilisation ayant pour objet ou pour effet d\'évaluer,
d\'analyser, de comparer ou de prédire leurs pratiques professionnelles
réelles ou supposées. La violation de cette interdiction est punie des
peines prévues aux articles 226-18,226-24 et 226-31 du code pénal, sans
préjudice des mesures et sanctions prévues par la loi n° 78-17 du 6
janvier 1978 relative à l\'informatique, aux fichiers et aux
libertés. »*.

Le profilage des magistrats et des membres du greffe est ainsi
formellement prohibé par la loi et la violation de cette interdiction
est susceptible de faire l'objet de poursuites tant pénales que civiles.

La Cour de cassation et tout réutilisateur s'engagent à ne pas procéder
à une indexation des données d\'identité des magistrats et des membres
du greffe ayant pour objet ou pour effet d\'évaluer, d\'analyser, de
comparer ou de prédire leurs pratiques professionnelles réelles ou
supposées.

PROTECTION DES DONNEES A CARACTERE PERSONNEL
============================================

Il est rappelé que l'article L. 322-2 du CRPA prévoit que *« la
réutilisation d\'informations publiques comportant des données à
caractère personnel est subordonnée au respect des dispositions de la
[loi n° 78-17 du 6 janvier
1978](https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000000886460&categorieLien=cid)
relative à l\'informatique, aux fichiers et aux libertés. ».*

Les décisions de justice mises à la disposition du public sont
susceptibles de contenir des données à caractère personnel et le
réutilisateur, responsable de son traitement, s'engage à respecter la
règlementation applicable à la protection des données personnelles.

Le réutilisateur s'engage particulièrement à prévenir tout risque de
ré-identification des personnes physiques dont les données personnelles
ont fait l'objet d'une pseudonymisation par la Cour de cassation. Tout
risque doit être notifié à la Cour de cassation dans un délai de 72
heures à compter de sa découverte.

EXERCICE DES DROITS D'ACCES ET DE RECTIFICATION (RGPD)
======================================================

  {#section-4 .list-paragraph}

Les droits d'accès et de rectification, prévus respectivement aux
articles 15 et 16 du RGPD, s'exercent auprès du service de
documentation, des études et du rapport (SDER) de la Cour de cassation,
soit à l'adresse structurelle *ad hoc*
(<anonymisation.sder.courdecassation@justice.fr>) soit par courrier
simple ou recommandé (Cour de cassation -- SDER -- 5 quai de l'Horloge
-- **TSA n° 79 201 -- 75055 Paris Cedex 01).**

La personne concernée recevra par retour, dans les mêmes formes que la
saisine, un accusé de réception de sa demande et il lui sera demandé de
justifier de son identité si cet élément n'avait pas été transmis avec
la demande et, pour le droit de rectification, de produire les pièces à
l'appui de sa demande le cas échéant.

Conformément à l'article 12.3 du RGPD, la demande sera traitée dans les
meilleurs délais et, en tout état de cause, dans le délai d'un mois à
compter de la réception de la demande. Ce délai pourra être prolongé de
deux mois, compte tenu de la complexité et du nombre de demandes. La
personne concernée sera alors informée de cette prolongation et des
motifs du report dans un délai d\'un mois à compter de la réception de
la demande.

La réponse, motivée en cas de refus, sera adressée à la personne
concernée soit par courrier recommandé avec demande d'avis de réception,
soit par voie électronique, si la personne concernée a présenté sa
demande sous forme électronique, sauf si elle demande qu'il en soit
autrement.

CORRECTION DU DEFAUT D'OCCULTATION DES NOMS ET PRENOMS DES PERSONNES PHYSIQUES MENTIONNEES DANS LES DECISIONS DE JUSTICE
========================================================================================================================

Le 2^e^ alinéa de l'article L. 111-13 du code de l'organisation
judiciaire prévoit que les nom et prénoms des personnes physiques
mentionnées dans la décision, lorsqu'elles sont parties ou tiers, sont
occultés préalablement à la mise à la disposition du public.

Toute demande de correction d'un défaut d'occultation des noms et
prénoms des personnes physiques peut être présentée, sans formalité
particulière, au service de documentation, des études et du rapport de
la Cour de cassation. Pour assurer un traitement rapide, une saisine par
mail, à l'adresse <anonymisation.sder.courdecassation@justice.fr>, est
préférable, bien que tout autre mode de saisine soit recevable.

Le réutilisateur s'engage à transmettre sans délai à la Cour de
cassation, à l'adresse <anonymisation.sder.courdecassation@justice.fr>,
toute demande dont il serait directement saisi relative à un défaut
d'occultation du nom et/ou des prénoms d'une personne physique, partie
ou tiers, citée dans une décision de justice mise à la disposition du
public par la Cour de cassation. Il procède, en outre, à l'occultation
des noms et prénoms de personnes physiques, occultation « socle » prévue
par la loi sans marge d'appréciation. Cette transmission, destinée à
protéger les droits des personnes physiques mentionnées dans les
décisions, et résultant d'une obligation légale, ne confère pas au
réutilisateur la qualité de sous-traitant.

TRAITEMENT DES DEMANDES D'OCCULTATION OU DE LEVEE D'OCCULTATION (ARTICLE R.111-13 du COJ)
=========================================================================================

L'article R. 111-13 du code de l'organisation judiciaire prévoit que
*« toute personne intéressée peut introduire, à tout moment, devant un
magistrat de la Cour de cassation désigné par le premier président, une
demande d\'occultation ou de levée d\'occultation des éléments
d\'identification ayant fait l\'objet de la décision mentionnée à
l\'article R. 111-12. »*.

Par conséquent, la Cour de cassation dispose d'une compétence exclusive
pour traiter les demandes tendant à modifier la décision relative aux
occultations complémentaires prise par le président de la formation de
jugement, par le magistrat ayant rendu la décision ou par le président
de la juridiction concernée qu'il s'agisse d'une demande tendant à
occulter d'autres éléments complémentaires ou à lever l'occultation de
certains éléments.

Le réutilisateur ne peut modifier la pseudonymisation d'une décision de
justice de sa propre initiative, que ce soit pour lever des occultations
ou en ajouter, sauf à contrevenir à l'article R. 111-13 du code de
l'organisation judiciaire.

Le réutilisateur saisi d'une demande d'occultation ou de levée
d'occultation s'engage à informer le demandeur que sa demande relève de
la seule compétence du magistrat de la Cour de cassation désigné par le
premier président de cette cour à qui il doit présenter sa demande. Il
lui rappellera que cette demande peut être adressée à l'adresse mail
<occultations.courdecassation@justice.fr>. Cette information, destinée à
protéger les droits des personnes physiques mentionnées dans les
décisions, ne confère pas au réutilisateur la qualité de sous-traitant.

CLAUSES PARTICULIERES RELATIVES A L'API
=======================================

L'API mise à disposition par la Cour de cassation a pour but de
permettre une récupération et une réutilisation facilitées des décisions
rendues publiquement par la Cour de cassation et par les chambres
civiles, sociales et commerciales des cours d'appel, éventuellement
enrichies, et pseudonymisées.

L'accès à l'API est ouvert à toute personne. L'utilisation de la base de
données est libre et gratuite, conformément à l'article L. 324-1 du code
des relations entre le public et l'administration. Ce service est mis à
disposition, sous certaines conditions détaillées dans les présentes
conditions générales d'utilisation, à partir de l'adresse suivante :
<https://api.piste.gouv.fr/cassation/judilibre/v1>.

Description de l'API Judilibre
------------------------------

L'API Judilibre a pour but de faciliter :

-   La mise à disposition des décisions de justice de l'ordre judiciaire
    dont la responsabilité a été confiée à la Cour de cassation,

-   De permettre une réutilisation facilitée et rapide de ces données
    grâce à l'emploi de formats ouverts et adaptés.

> N.B : L'API Judilibre est actuellement en version bêta. La fiabilité
> des données exposées dans ce cadre n'est, par conséquent, pas
> garantie, qu'il s'agisse notamment :

-   Du contenu (données et métadonnées) renvoyé,

-   De sa complétude,

-   Ou encore de sa fraîcheur.

En cas de difficulté concernant des données ou des méthodes de l'API
Judilibre (points d'entrée), veuillez contacter la Cour de cassation à
l'adresse électronique suivante :
<anonymisation.sder.courdecassation@justice.fr>.

Compte tenu de l'absence de garantie de fiabilité des données et de
disponibilité de l'API, son usage se fait aux risques et péril de
l'utilisateur.

Mise à disposition de l'API Judilibre
-------------------------------------

> L'API Judilibre est mise à disposition dans le catalogue d'interfaces
> applicatives de PISTE.
>
> Cette mise à disposition est gratuite.
>
> Afin de consommer l'API Judilibre, il est nécessaire de :

-   S'inscrire sur PISTE et accepter les CGU de PISTE,

-   Choisir d'utiliser l'API Judilibre dans le catalogue d'API de PISTE
    et accepter les présentes CGU.

Conditions d'accès à PISTE et à l'API Judilibre
-----------------------------------------------

Les utilisateurs sont responsables des identifiants utilisés pour
accéder à l'API Judilibre et doivent respecter l'état de l'art en
matière de sécurité informatique dans l'usage de ces identifiants. Ils
sont également responsables de la sécurité des équipements informatiques
qu'ils utilisent pour accéder à l'API et aux données, notamment en
mettant en place une solution antivirus à jour, une mise à jour
régulière des correctifs de sécurité, un pare-feu local, un contrôle des
autorités de certification autorisées, l'interdiction de mémorisation
des mots de passe dans le navigateur et le verrouillage automatique des
sessions sur les postes informatiques.

L'accès à PISTE se fait par un compte nominatif, protégé par un
identifiant et mot de passe sécurisés.

L'accès à l'API Judilibre est réalisé via PISTE, après authentification
par le protocole Oauth 2.0 lors de chaque requête.

ATTENTION : vos clés d'authentification à l'API Judilibre sont
strictement réservées à votre application et ne doivent en aucun cas
être rendues publiques ou divulguées à un tiers.

D.  Engagements de l'API Judilibre
    ------------------------------

    -   [Disponibilité de l'API Judilibre]{.underline} :

> L'API mise à disposition par la Cour de cassation est actuellement en
> version bêta.
>
> Cela signifie que l'API Judilibre peut être indisponible et que la
> Cour de cassation ne garantit aucun niveau minimal de disponibilité de
> celle-ci.
>
> La Cour de cassation met la base Open Data à disposition, au mieux de
> ses possibilités, en continu. Le service pourra ponctuellement être
> interrompu en cas de maintenance prévue ou de circonstances imprévues.
>
> La Cour de cassation n'est pas réputée faillir en cas de retard ou
> d'interruption du service résultant, directement ou indirectement, de
> tout évènement ou circonstance indépendant de sa volonté.

-   [Gestion de l'API Judilibre]{.underline} :

> La Cour de cassation assure les rôles et/ou opérations suivants :

-   Supervision de l'API Judilibre et gestion technique des équipements
    afférents,

-   Sauvegarde des données stockées sur le serveur,

-   Support aux utilisateurs de l'API Judilibre.

```{=html}
<!-- -->
```
-   [Restrictions de l'API Judilibre]{.underline} :

> Afin de protéger le bon fonctionnement de l'API Judilibre, la Cour de
> cassation a mis en place des quotas d'utilisation de son API.
>
> Ces quotas ont pour but de limiter par seconde / minute / jour :

-   Soit le nombre de requête,

-   Soit la bande passante utilisée.

> Ces quotas peuvent être appliqués soit pour l'ensemble de
> l'application consommatrice, soit pour une méthode particulière de
> l'API Judilibre.
>
> Ils peuvent être consultés à tout moment sur PISTE dans la partie de
> gestion d'une application, en allant dans « API Sélectionnées », puis
> en cliquant sur « Actions » et enfin sur « Consulter les quotas ».
>
> La Cour de cassation peut être amenée à tout moment à procéder à des
> modifications de ces quotas. Les utilisateurs seront informés de toute
> modification, par tout moyen à la convenance de la Cour de cassation.

Engagements des utilisateurs
----------------------------

 {#section-5 .list-paragraph}

-   [Responsabilité de l'utilisateur]{.underline} :

> L'utilisateur est seul responsable de l'usage qu'il fait de l'API
> Judilibre, lequel doit être strictement conforme aux lois et
> réglementations en vigueur.
>
> Par conséquent, l\'utilisateur s\'engage à indemniser la Cour de
> cassation et toute personne physique ou morale qui lui est liée et
> dont la responsabilité serait susceptible d\'être engagée, de tout
> préjudice subi résultant de l'utilisation de l'API Judilibre non
> conforme aux présentes CGU, et les garantit contre toute action fondée
> sur une telle utilisation.

-   [Sécurité des équipements informatiques utilisés pour accéder à
    l'API Judilibre]{.underline} :

> Les utilisateurs sont responsables des équipements informatiques
> utilisés pour accéder à l'API Judilibre qui doivent respecter l'état
> de l'art en matière de sécurité informatique.
>
> Lors de l'utilisation de l'API Judilibre, l'utilisateur ou son entité
> de rattachement doit s'assurer que les équipements informatiques ou
> son environnement d'exécution disposent des protections ad-hoc contre
> la malveillance et que l'utilisateur est sensibilisé aux risques de
> sécurité liés à son activité.
>
> Conformément aux exigences de la Politique de Sécurité des Systèmes
> d'Information de l'État (PSSIE), la Cour de cassation recommande en
> particulier que les équipements intègrent :

-   Une solution antivirus à jour,

-   Une mise à jour régulière des correctifs de sécurité,

-   Un pare-feu local,

-   Un contrôle des autorités de certification autorisées,

-   L'interdiction de mémorisation des mots de passe dans le navigateur,

-   Le verrouillage automatique des sessions sur les postes des
    développeurs.

```{=html}
<!-- -->
```
-   [Compromission de vos identifiants Oauth ou d'accès à
    PISTE]{.underline} :

> Tous les utilisateurs de l'API Judilibre sont acteurs de la sécurité
> de celle-ci et doivent notifier à la Cour de cassation / AIFE tout
> incident ou accès anormal à l'API Judilibre ou à PISTE, afin que la
> Cour de cassation / AIFE puissent vérifier qu'aucune action
> frauduleuse n'a été intentée à leur insu.
>
> En cas de compromission ou suspicion de compromission des identifiants
> Oauth ou d'accès à PISTE (surconsommation sur l'API Judilibre,
> publication des identifiants en ligne, etc.) des utilisateurs, les
> utilisateurs s'engagent à :

-   Réinitialiser ces identifiants sur PISTE au plus vite,

-   Avertir la Cour de cassation et / ou l'AIFE dans les plus brefs
    délais.

RESPONSABILITE
==============

Tout réutilisateur est responsable de son traitement.

La Cour de cassation ne saurait être tenue pour responsable de toute
utilisation des données contenues dans la base Open Data entraînant un
risque d'atteinte à la sécurité ou à la vie privée des personnes
physiques concernées par les données traitées.

Tout réutilisateur a, en outre, l'obligation de diffuser des données
intègres, exactes et tenues à jour, comme défini à l'article V, et il en
assume seul l'entière responsabilité.

La Cour de cassation ne saurait pas, non plus, être tenue pour
responsable des conséquences de l'utilisation de données dont le
réutilisateur aurait altéré l'intégrité, qu'il aurait dénaturé ou qui
n'auraient pas été mises à jour.

La Cour de cassation ne pourra être tenue responsable d'un quelconque
dommage subi par un utilisateur ou un tiers utilisant une application
fondée sur les données exposées par l'API Judilibre.

L'utilisateur assumera seul une action engageant sa responsabilité
contractuelle ou extracontractuelle liée directement ou indirectement à
son utilisation de l'API Judilibre, et qui pourrait notamment être liée
à un manque de fiabilité des données, à leur manque de fraîcheur, ou à
l'indisponibilité temporaire (rupture de service) ou permanente de l'API
Judilibre.

Outre les sanctions prévues à l'article L. 326-1 du CRPA, tout
manquement du réutilisateur aux présentes conditions générales
d'utilisation pourra conduire la Cour de cassation à :

-   Interrompre temporairement la mise à disposition des données jusqu'à
    la résolution du manquement,

-   Interrompre définitivement la mise à disposition des données si le
    manquement est grave ou réitéré et notamment s'il concerne un
    manquement à la protection des données personnelles, après mise en
    demeure restée infructueuse.

La Cour de cassation se réserve le droit de vérifier ou de faire
vérifier que les dispositions des présentes conditions générales
d'utilisation et de la licence ouverte de réutilisation d'informations
publiques version 2.0 sont respectées et, à défaut, d'engager toute
action en réparation du préjudice subi.

PROPRIETE INTELLECTUELLE
========================

Le réutilisateur reconnaît que la compilation des données sous une forme
précise, la présentation et la conception de la base Open Data sont
protégées par la réglementation applicable, notamment par le droit
d'auteur et par le droit *sui generis* des producteurs de bases de
données.

L'accès du réutilisateur aux données de la Cour de cassation n'emporte
pas acquisition d'un quelconque droit de propriété. La concession
accordée relève d'un simple droit de réutilisation des données selon les
modalités définies par les présentes conditions générales d'utilisation
et par la licence ouverte de réutilisation d'informations publiques
version 2.0.

LITIGE / DROIT APPLICABLE
=========================

Les présentes conditions générales d'utilisation sont régies par le
droit français.

En cas de litige portant sur l'interprétation ou l'application des
présentes conditions générales d'utilisation, la Cour de cassation et le
réutilisateur conviennent de s'en remettre, après épuisement des voies
amiables, à l'appréciation des tribunaux de la compétence du ressort du
concédant.
