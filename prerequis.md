# Guide de Déploiement Judilibre-search sur CloudPi

Ce document décrit les étapes nécessaires pour déployer l'application **[ judilibre-search ]**.

---

## 📂 Pré-requis

Avant de commencer, assurez-vous d'avoir :
- Télécharger le fichier [sops-secret.yaml](helm/templates/secret-sops.yaml), changer le secret si besoin, puis l'encrypter , en utilisant l'utilitaire [SOPS](https://github.com/getsops/sops) et le réuploader sur le repos.

```shell
sops -e --age $AGE_KEY --encrypted-regex "^(data|stringData)$" sops-secret.yaml > sops-secret.enc.yaml
```
 Attention ! dans le secret, la partie data, doit contenir  des charactère en base64

- Dans le fichier [values.yaml](helm/values.yaml), renseigner les champs suivant :

```yaml
image:
  # Renseigner le repositor de l'image ici
  repository: 
  # This sets the pull policy for images.
...
imagePullSecrets:
- name: # Nom de l'image pull secret
...
# This block is for setting up the ingress for more information can be found here: https://kubernetes.io/docs/concepts/services-networking/ingress/
ingress:
  enabled: false
  className: ""
  annotations: {}
    # kubernetes.io/ingress.class: nginx
    # kubernetes.io/tls-acme: "true"
  hosts:
    - host:
      paths:
        - path: /
          pathType: Prefix
  #tls: []
  #  - secretName: chart-example-tls
  #    hosts:
  #      - chart-example.local
  tls:
  - hosts: 
```
Pour l'ingress il faut se rapprocher du Responsable Hebergement.

- Synchroniser le repos sur le projet CloudPi, cocher la case "code d'infrastructure" et enregistrer

- Lancer la pipeline pour build l'image:

 Services Externes > Gitlab > 'Nom du depôt' > Build > Pipelines > Run pipeline > Selectionner la bonne branche CPi... > Run pipeline.

- Etant données notre configuration en mode "Branche", pour finaliser le deploiement de l'application il faut suivres les étapes suivante :

  Services Externes > ArgoCD > choisir notre application > Appuyer sur l'objet kind Application > EDIT > Target Revision: chosir la branche CPi > Save

- resynchroniser l'application si besoin.


