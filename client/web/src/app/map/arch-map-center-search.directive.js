'use strict'
angular.module('archCarto')
  .directive('archMapCenterSearch', function(archHttpService) {
    return {
      restrict: 'E',
      require: '^archMap',
      scope: {},
      templateUrl: 'app/map/arch-map-center-search.html',
      link: function(scope, element, attributes, archMap) {
        scope.chooseCenter = function(center) {
          archMap.setCenter(center)
            .catch(function(err) {
              $log.error(err);
            });
        };

        scope.extractCenter = function(item) {
          if (angular.isDefined(item)) {
            archMap.getCenter()
              .then(function(center) {
                center.lat = parseFloat(item.lat);
                center.lng = parseFloat(item.lon);
                scope.chooseCenter(center);
              });
          }
        };

        scope.getMatchLocations = function(search) {
          return archHttpService.get('http://open.mapquestapi.com/nominatim/v1/search.php', {
            params: {
              format: 'json',
              q: search,
              limit: 5
            }
          });
        };
      }
    }
  });
