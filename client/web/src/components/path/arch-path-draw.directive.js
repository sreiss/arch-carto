'use strict'
angular.module('archCarto')
  .directive('archPathDraw', function(archPathService, archPathJunctionService, $q, $mdSidenav, $mdToast, archTranslateService, archPathCoatingService) {
    return {
      restrict: 'E',
      require: ['^archMap', '^archPath'],
      templateUrl: 'components/path/arch-path-draw.html',
      link: function(scope, element, attributes, controllers) {
        var archMap = controllers[0];
        var archPath = controllers[1];

        if(scope.id) {
          $mdSidenav('right').open();

          scope.medias = [];
          archPathCoatingService.getList()
            .then(function(result) {
              scope.coatings = result.value;
            });

          // If we are just editing the path
          archPathService.get(scope.id)
            .then(function (result) {
              scope.path = result.value;

              scope.save = function (path) {
                for (var i = 0; i < scope.medias.length; i += 1) {
                  path.properties.medias.push(scope.medias[i].data._id);
                }
                archPathService.save(path)
                  .then(function (result) {
                    archTranslateService(result.message)
                      .then(function (translation) {
                        scope.$emit('pathUpdated', result.value);
                        $mdToast.show($mdToast.simple().content(translation));
                      });
                  });
              };
            });
        }

      }
    };
  });
