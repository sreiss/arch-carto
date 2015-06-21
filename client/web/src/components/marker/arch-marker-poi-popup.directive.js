'use strict'
angular.module('archCarto')
  .directive('archMarkerPoiPopup', function($templateCache, archMarkerPoiService, httpConstant, $rootScope) {
    return {
      restrict: 'E',
      templateUrl: 'components/marker/arch-marker-poi-popup.html',
      link: function(scope, element, attributes) {
        scope.apiUrl = httpConstant.cartoServerUrl;

        var refreshPoi = function() {
          archMarkerPoiService.get(scope.id)
            .then(function (result) {
              scope.poi = result.value;
            });
        };
        refreshPoi();

        $rootScope.$on('poiMediaAttached', function(event, poi) {
          if (poi._id == scope.poi._id) {
            refreshPoi();
          }
        });
      }
    }
  });
