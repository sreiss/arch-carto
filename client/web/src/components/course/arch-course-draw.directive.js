'use strict';
angular.module('archCarto')
  .directive('archCourseDraw', function($mdSidenav, archCourseService, archInfoService, $state, leafletData, $log) {
    return {
      restrict: 'E',
      require: ['^archMap', '^archCourseDraw'],
      templateUrl: 'components/course/arch-course-draw.html',
      controller: function($scope) {
        var _currentLayer;

        $scope.course = false;

        $scope.cancel = angular.noop;
        this.removeCurrentLayer = angular.noop;
        this.getCurrentLayer = angular.noop;

        if (!$scope.id) {
          $scope.course = archCourseService.getTemplate();
          leafletData.getMap()
            .then(function (map) {
              map.on('draw:created', function (e) {
                var layerType = e.layerType;
                _currentLayer = e.layer;

                if (layerType == 'polyline') {
                  map.addLayer(_currentLayer);
                  var latLngs = _currentLayer.getLatLngs();
                  latLngs.forEach(function (latLng) {
                    $scope.course.geometry.coordinates.push([
                      latLng.lng,
                      latLng.lat
                    ]);
                  });
                }

                $mdSidenav('right').open();
                archInfoService.getDistance($scope.course).then(function(distance){
                  $scope.course.properties.length = distance;
                });

                $scope.cancel = function () {
                  map.removeLayer(_currentLayer);
                  $mdSidenav('right').close()
                    .then(function () {
                      _currentLayer = false;
                      $scope.cancel = angular.noop;
                      $state.go('map.course.draw');
                    });
                };
              });
            });
        } else {
          $mdSidenav('right').open();
          $scope.cancel = function() {
            $mdSidenav('right').close();
            $scope.course = false;
            $scope.cancel = angular.noop;
            $state.go('map.course.draw', {id: ''});
          };
          archCourseService.get($scope.id)
            .then(function(result) {
              $scope.course = result.value;
              archInfoService.getDistance($scope.course).then(function(distance){
                $scope.course.properties.length = distance;
              });
            })
            .catch(function(err) {
              $log.error(err);
            });
        }
      },
      link: function(scope, element, attributes, controllers) {
        var archMap = controllers[0];
        var archCourse = controllers[1];

        scope.save = function(course) {
          console.log(course);
          archCourseService.save(course);
        };

        archMap.getLayer('course')
          .then(function(layer) {
            archMap.addControl('draw', L.Control.Draw, {
              draw: {
                polygon: false,
                marker: false,
                rectangle: false,
                circle: false
              },
              edit: {
                featureGroup: layer.editable
              }
            });
          })
          .catch(function(err) {
            $log.error(err);
          });

        // Suppression des controls de draw lors du changement d'action.
        scope.$on('$destroy', function() {
          archMap.removeControl('draw')
            .then(function() {
              archCourse.removeCurrentLayer();
            })
            .catch(function(err) {
              $log.error(err);
            });
        });
      }
    }
  });
