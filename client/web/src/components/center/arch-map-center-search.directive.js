'use strict'
angular.module('archCarto')
  .directive('archMapCenterSearch', function(archHttpService) {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/center/arch-map-center-search.html',
      link: function(scope, element, attributes, archMap) {
        scope.chooseCenter = function(center) {
          archMap.setCenter(center);
          scope.closeRight();
        };

        scope.extractCenter = function(item) {
          if (angular.isDefined(item)) {
            scope.center.latitude = parseFloat(item.lat);
            scope.center.longitude = parseFloat(item.lon);
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