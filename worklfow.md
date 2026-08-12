# Workflow

L'application vit dans deux systèmes reliés par le mirroring Git : GitHub (source,
plateforme publique) et le GitLab interne (plateforme privée). Le dépôt GitHub est
répliqué sur le GitLab interne par un `git push --mirror`, ce qui y propage toutes
les branches et tous les tags.

## CI

1. Je développe sur une branche de feature
2. À la création d'une PR, le workflow [ci.yml](/.github/workflows/ci.yml) est lancé :
   il vérifie le code, construit l'image et contrôle le contenu du répertoire ansible
3. Si la PR est ok, je peux merger : [ci.yml](/.github/workflows/ci.yml) est à
   nouveau lancé

## CD — plateforme privée

Le pipeline [.gitlab-ci.yml](/.gitlab-ci.yml) hérite du template partagé
`template/gitlab-ci-template.yml` du projet `ops-automation`, comme les autres
applications de la plateforme. Il est **autonome** : il construit lui-même son image
et la pousse dans le registry GitLab interne, sans dépendre de GitHub ni de Docker Hub.

Le template attend trois conventions, respectées ici :

- le playbook de déploiement est [ansible/deploy_app.yml](/ansible/deploy_app.yml)
- l'image est passée au playbook via la variable `app_image`
- les inventaires sont dans `ansible/inventory/<environnement>.yml`

La variable `DOCKER_BUILD_ARGS` vaut `--target=production` : le dernier étage du
[Dockerfile](/Dockerfile) est `local` (développement), et Docker prend le dernier
étage comme cible par défaut. Sans cette précision, c'est l'image de développement
qui serait livrée.

Chaque environnement a sa propre image, taguée par le SHA court du commit :
`$CI_REGISTRY/cour-de-cassation/judilibre-search/<environnement>:<sha>`.

### Déployer une version de test depuis une branche

1. Je pousse ma branche
2. Le job `build_and_push_dev` apparaît en **manuel** : je le déclenche
3. Le SBOM est généré (syft), l'image est scannée (grype), puis `deploy_dev`
   déploie automatiquement sur l'environnement de dev privé

Aucun tag n'est nécessaire, et rien ne transite par GitHub ou Docker Hub.

### Déployer en preprod et en prod

Sur un tag, les jobs `build_and_push_preprod` et `build_and_push_prod` sont
disponibles en manuel ; chacun déclenche à sa suite SBOM, scan, puis le déploiement
de l'environnement correspondant. Si l'image du même commit existe déjà pour un
autre environnement, le template la retague au lieu de la reconstruire : c'est donc
exactement le binaire testé qui est promu.

## CD — plateforme publique (Scaleway)

Les clusters Scaleway ne peuvent pas atteindre le registry GitLab interne : ils
tirent leur image depuis Docker Hub. Le déploiement est porté par
[deploy-scaleway.yml](/.github/workflows/deploy-scaleway.yml), qui exécute le
**même rôle Ansible** que la plateforme privée — seules les valeurs des
`group_vars` changent, et le playbook est
[ansible/deploy_app_public.yml](/ansible/deploy_app_public.yml).

Le déclenchement est **manuel** : rien ne part sur un push ni sur un tag.

1. *Actions* → « Déploiement sur Scaleway » → *Run workflow*
2. `target` : `dev-par1`, `prod-par1`, `prod-par2` ou `prod-les-deux`, cette
   dernière n'enchaînant le second site que si le premier a réussi
3. `image` : laissée **vide**, l'image du commit est déployée — construite et
   publiée sous `<organisation>/judilibre-search:<sha court>` si le registre ne
   la porte pas déjà. **Renseignée**, cette référence est déployée telle quelle,
   sans construction : c'est ce qui permet de redéployer une image déjà en
   service ou de revenir à une version antérieure

Le job enchaîne ensuite kubeconfig, résolution de l'image, déploiement Ansible,
puis un contrôle sur l'**URL publique** — qui traverse l'Ingress, le certificat
et le LoadBalancer, ce que les sondes du conteneur ne prouvent pas. Si le
déploiement ou ce contrôle échoue, le Deployment revient à sa révision
précédente.

Comme un même commit donne une même étiquette, déployer `dev-par1` puis les deux
sites de production depuis ce commit livre exactement le même artefact.

**Périmètre** : namespace, Service et Deployment. Les autres objets d'un cluster
— Ingress, Secrets, Elasticsearch, LoadBalancer, certificats — sont créés par
`judilibre-ops`. Le namespace est partagé avec `judilibre-admin`.

### Le tag, côté public

[tag.yml](/.github/workflows/tag.yml) est indépendant de ce qui précède : un tag
`X.Y.Z` construit et publie `<organisation>/judilibre-search:<tag>` sur Docker Hub,
sans déclencher aucun déploiement.
