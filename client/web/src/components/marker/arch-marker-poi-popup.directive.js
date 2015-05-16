'use strict'
angular.module('archCarto')
  .directive('archMarkerPoiPopup', function($templateCache, archMarkerPoiService, httpConstant, $rootScope) {
    return {
      restrict: 'E',
      templateUrl: 'components/marker/arch-marker-poi-popup.html',
      link: function(scope, element, attributes) {
        scope.apiUrl = httpConstant.apiUrl;

        var refreshPoi = function() {
          archMarkerPoiService.get(scope.poiId)
            .then(function (poi) {
              scope.poi = poi;
            });
        };
        refreshPoi();

        $rootScope.$on('poiMediaAttached', function(event, poi) {
          debugger;
          if (poi._id == scope.poi._id) {
            refreshPoi();
          }
        });
      }
    }
  });
