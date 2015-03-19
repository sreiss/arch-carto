# arch-carto : Application de cartographie

# server

Les mêmes étapes que sur https://github.com/sreiss/arch-core sont nécessaire pour lancer le projet.

# client

## web

Ce dossier contient l'application web AngularJS de cartographie.

Pour lancer l'application cliente de cartographie, il faut avant tout lancer le serveur Arch carto. La façon de le lancer est la même que arch core, je vous invite donc à lire les étapes décrites sur le git server. Si vous l'avez déjà fait mais que vous ne vous souvenez plus exactement : il faut lancer MongoDB puis l'application. Ensuite :

1. Se rendre dans le dossier arch-client et lancer les commandes :```npm install```, ```bower install```, ```gulp build``` puis ```gulp serve```.
2. Vous vous heurterez alors à un problème de Cross Origin, les navigateurs modernes empêchant, par sécurité, l'accès en AJAX à des ressources locales. Une solution pour contourner ce problème est de lancer le serveur sur un serveur distant (sterne par exemple), une autres est d'installer une extension pour votre navigateur pour permettre l'AJAX en local. Pour chrome, j'ai trouvé celle-ci : [Allow-Control-Allow-Origin: *](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi)
3. Vous pouvez cliquer sur la carte pour ajouter un point d'intérêt. Je n'ai pas encore mis en place la suppression d'un point.

Les fichiers sources de l'application se trouvent dans **src**. Gulp Angular se charge de compiler l'application pour vous et de l'optimiser. Je vous invite à jeter un coup d'oeil à sa [doc](https://github.com/Swiip/generator-gulp-angular)
