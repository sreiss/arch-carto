'use strict'
angular.module('archCarto')
  .directive('archMapCenterSearch', function(archHttpService, ARCH_MAP_INIT) {
    return {
      restrict: 'E',
      require: '^?archMap',
      scope: {
        center: '=?mapCenter'
      },
      templateUrl: 'app/map/arch-map-center-search.html',
      link: function(scope, element, attributes, archMap) {
        scope.chooseCenter = function(center) {
          if (archMap) {
            center.zoom = ARCH_MAP_INIT.defaultZoom;
            archMap.setCenter(center)
              .catch(function (err) {
                $log.error(err);
              });
          } else {
            if (scope.center) {
              scope.center = center;
            } else {
              throw new Error('A center object must be passed to archMapCenterSearch.');
            }
          }
        };

        scope.extractCenter = function(item) {
          if (angular.isDefined(item)) {
            var lat = parseFloat(item.lat);
            var lng = parseFloat(item.lon);
            if (archMap) {
              archMap.getCenter()
                .then(function (center) {
                  center.lat = lat;
                  center.lng = lng;
                  scope.chooseCenter(center);
                });
            } else {
              scope.chooseCenter({
                lat: lat,
                lng: lng
              });
            }
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
