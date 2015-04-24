'use strict'
angular.module('archCarto')
  .directive('archMapCenterSearch', function(archHttpService) {
    return {
      restrict: 'E',
      require: '^archMap',
      scope: {},
      templateUrl: 'components/center/arch-map-center-search.html',
      link: function(scope, element, attributes, archMap) {
        scope.center = archMap.getCenter();

        scope.chooseCenter = function(center) {
          archMap.setCenter(center);
        };

        scope.extractCenter = function(item) {
          if (angular.isDefined(item)) {
            scope.center.lat = parseFloat(item.lat);
            scope.center.lng = parseFloat(item.lon);
          }
          scope.chooseCenter(scope.center);
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
