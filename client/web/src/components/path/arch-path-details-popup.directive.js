'use strict'
angular.module('archCarto')
  .config(['$compileProvider',
    function ($compileProvider) {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
    }])
  .directive('archPathDetailsPopup', function($rootScope, archPathService, httpConstant, archInfoService) {
    return {
      restrict: 'E',
      templateUrl: 'components/path/arch-path-details-popup.html',
      link: function(scope, element, attributes) {
        scope.apiUrl = httpConstant.cartoServerUrl;
        var refresh = function() {
          archPathService.get(scope.id)
            .then(function (result) {
              scope.path = result.value;
              var blob = new Blob([ togpx(result.value) ], { type : 'text/plain' });
              scope.url = (window.URL || window.webkitURL).createObjectURL( blob );
              archInfoService.getDistance(result.value)
                .then(function(distance){
                  scope.length = distance;
                });
            });
        };
        scope.linkDownload = function(geoJson){
          var blob = new Blob([ togpx(geoJson) ], { type : 'text/plain' });
          scope.url = (window.URL || window.webkitURL).createObjectURL( blob );
        };
        refresh();

        $rootScope.$on('pathUpdated', function(event, path) {
          if (path._id == scope.path._id) {
            refresh();
          }
        });
      }
    }
  });
