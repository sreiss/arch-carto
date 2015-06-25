'use strict';
angular.module('archCarto')
  .directive('archMarkerMedia', function($state, $mdSidenav, $mdToast, archMarkerPoiService, httpConstant, archTranslateService) {
    return {
      restrict: 'E',
      templateUrl: 'components/marker/arch-marker-media.html',
      controller: function($scope, $stateParams) {
        $mdSidenav('right').open();

        $scope.uploadUrl = httpConstant.cartoServerUrl + '/map/media';

        $scope.type = $stateParams.type;
        $scope.medias = [];

        var unregisterWatch = angular.noop;

        switch($scope.type) {
          case 'poi':
                archMarkerPoiService.get($stateParams.id, {
                    'no-type': true,
                    'no-audit': true,
                    'no-medias': true
                  })
                  .then(function(result) {
                    unregisterWatch = $scope.$watch('medias', function(medias) {
                      if (medias && medias.length > 0) {
                        for (var i = 0; i < medias.length; i += 1) {
                          var media = medias[i];
                          result.value.properties.medias.push(media.data.value._id);
                        }

                        archMarkerPoiService.save(result)
                          .then(function (savedPoi) {
                            $scope.$emit('poiMediaAttached', $scope.marker);
                            archTranslateService('MEDIAS_SAVED_FOR_POI')
                              .then(function (translation) {
                                $mdToast.show({
                                  message: translation,
                                  position: 'bottom left'
                                });
                              });
                          });
                      }
                    }, true);
                  });
        }

        $scope.$on('$destroy', function() {
          unregisterWatch();
        });

        $scope.cancel = function() {
          $mdSidenav('right').close();
          $state.go('map.marker.choice');
          $scope.cancel = angular.noop;
        };
      }
    }
  });
