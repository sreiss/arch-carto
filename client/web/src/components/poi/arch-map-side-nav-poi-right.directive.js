'use strict'
angular.module('archCarto')
  .directive('archMapSideNavPoiRight', function($mdSidenav) {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/poi/arch-map-side-nav-poi-right.html',
      link: function(scope, element, attributes, archMap) {
        scope.close = function() {
          $mdSidenav('rightSideNav').close();
        };

        scope.savePoi = function() {
          archPoiService.savePoi(scope.poi)
            .then(function() {
              archMap.refreshMarkers();
              $translate(['POINT_OF_INTEREST_ADDED']).then(function(translations) {
                $mdToast.show($mdToast.simple().content(translations.POINT_OF_INTEREST_ADDED));
              });
            });
        };
      }
    }
  });
