# Workflow

Pour cette application le workflow est le suivant:

## CI

1) Je développe sur une branche de feature
2) Lorsque je crée une PR, le workflow [ci.yml](/.github/workflows/ci.yml) est lancé. Celui-ci vérifie le code, le build et le contenu du ansible
3) Si la PR est ok, je peux merge dans master: le workflow [ci.yml](/.github/workflows/ci.yml) est à nouveau lancé.

## CD

Pour déployer mon application, je dois créer un tag sur la branche master. 
1) Une fois le tag créé, le workflow [tag.yml](/.github/workflows/tag.yml) est lancé: il pousse l'image `judilibre/judilibre-search:$TAG` dans dockehub
2) Parallèlement, le [.gitlab-ci.yml](/.gitlab-ci.yml) lance le job `check_if_image_is_on_dockerhub` qui vient vérifier si l'image en question est bien dans Github (pour l'instant, le job échoue au bout d'une minute sans trouver l'image)
3) Si l'image est trouvée, alors elle est déployée dans la plateforme privée, dans l'environnement de dev: `deploy_dev`
4) Une fois l'application dans l'environnement de dev, on peut la déployer manuellement dans l'environnement de preprod de la plateforme privée (`deploy_preprod`).
5) Une fois l'application dans l'environnement de preprod, on peut la déployer dans la plateforme publique dans l'environnement de staging: `deploy_staging`. Le fonctionnement de ce job est un peu différent puisqu'il ne redéploie pas toutes les resources mais il se contente de changer le nom de l'image dans le cluster Kube
6) Une fois l'application dans l'environnement de staging, on peut la déployer dans la plateforme publique dans l'environnement de prod: `deploy_prod`.

