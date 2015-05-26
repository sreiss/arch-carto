'use strict';
angular.module('archCarto')
  .directive('archCourseDraw', function($mdSidenav, archCourseService, $state, leafletData, $log) {
    return {
      restrict: 'E',
      require: ['^archMap', '^archCourseDraw'],
      templateUrl: 'components/course/arch-course-draw.html',
      controller: function($scope) {
        $scope.course = archCourseService.getTemplate();

        var _currentLayer;

        $scope.cancel = angular.noop;
        this.removeCurrentLayer = angular.noop;
        this.getCurrentLayer = angular.noop;

        leafletData.getMap()
          .then(function(map) {
            map.on('draw:created', function(e) {
              var layerType = e.layerType;
              _currentLayer = e.layer;

              map.addLayer(_currentLayer);

              $mdSidenav('right').open();

              $scope.cancel = function() {
                map.removeLayer(_currentLayer);
                $mdSidenav('right').close()
                  .then(function() {
                    _currentLayer = false;
                    $scope.cancel = angular.noop;
                    $state.go('map.course.draw');
                  });
              };
            });
          });
      },
      link: function(scope, element, attributes, controllers) {
        var archMap = controllers[0];
        var archCourse = controllers[1];

        scope.save = function(course) {
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
