# Projet-node-h3
 
Vous êtes engagés par une filiale Universal studios pour créer l’API de la plateforme de soumission de maquettes par les artistes.

Le but est d’avoir un site sur lequel des artistes puissent poster leurs création, afin qu’elles soient écoutées par les managers, qui décideront s’ils financeront un album ou non.

Ce site sera consulté par les artistes, les manager, et un compte administrateur

Le compte administrateur est unique et créé par défaut. On peut seulement changer son mot de passe.

L’administrateur a accès à toutes les requêtes mais il ne peut pas uploader de maquettes 

Un artiste peut mettre en ligne une maquette et consulter ses anciennes maquettes

Il ne peut pas consulter les maquettes des autres.

Un manager peut consulter toutes les maquêtes.

Un manager peut laisser une approbation ou une désapprobation sur une maquette. Plusieurs manager peuvent laisser leur approbations ou désapprobation sur une seule maquette. 

Une fois que tous les managers ont donné leur avis sur une maquette, elle est validée.

Les approbations et désapprobation doivent être agrémentés d’un commentaire.

Les artistes s’inscrivent eux mêmes via une route /register

Les managers sont ajoutés par l’admin.

L’admin peut aussi supprimer n’importe quel compte.

L’admin a moyen de venir un artiste, ce qui ne le supprime pas mais l’empeche de poster de nouvelles maquettes.

On doit pouvoir retrouver, pour chaque maquette, un nom/url de fichier, un titre, l’artiste l’ayant posté.

Chaque approbation de manager doit contenir un flag indiquant si elle est positive ou négative, et un commentaire la justifiant 

Les utilisateurs se connectent via un email, mais chaque artiste peut renseigner un pseudo, qui doit alors être unique.

On doit retenir d’un utilisateur sa date d’inscription

L’api doit être faite avec expressjs, en typescript.

La persistance doit être faite via une BDD document telle que MongoDB pour la rapidité de développement

La bdd doit être ajoutée au projet via un docker-compose. (pour corriger c’est plus simple svp)

L’authentification et les permissions doivent être gérée via les JWT.

L’api recevra et enverra du json dans ses requêtes

Les mots de passe doivent être protégés dans la bdd. Ils ne doivent jamais apparaître dans une requête non plus.
