'use strict'
angular.module('archCarto')
  .directive('archMapTraceList', function(archGpxService, $mdToast, $translate) {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/gpx/arch-map-trace-list.html',
      controller: function($scope) {
        archGpxService.getTrace()
          .then(function(traces) {
            //console.log(JSON.stringify(traces.features,null,2));
            $scope.traces = traces;
          });
      },
      link: function(scope, element, attributes, archMap) {
      }
    };
  });
