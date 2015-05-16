'use strict'
angular.module('archCarto')
  .directive('archMarkerMedia', function($state, $mdSidenav, $mdToast, archMarkerPoiService, httpConstant, archTranslateService) {
    return {
      restrict: 'E',
      templateUrl: 'components/marker/arch-marker-media.html',
      controller: function($scope, $stateParams) {
        $mdSidenav('right').open();

        $scope.uploadUrl = httpConstant.apiUrl + '/map/media';

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
                  .then(function(poi) {
                    $scope.marker = poi;
                    unregisterWatch = $scope.$watch('medias', function(medias) {
                      if (medias && medias.length > 0) {
                        for (var i = 0; i < medias.length; i += 1) {
                          $scope.marker.properties.medias.push(medias[i].data._id);
                        }

                        archMarkerPoiService.save($scope.marker)
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
