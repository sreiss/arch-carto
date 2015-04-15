'use strict'
angular.module('archCarto')
  .directive('archMapTraceList', function(archGpxService, $mdToast, $translate,leafletData) {
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
        //scope.filterOptions = {
        //  status: 'resolved'
        //};

        scope.displayTrace = function(geoJson){
          //archMap.displayGeoJson(geoJson);
          archMap.displayElevation(geoJson);
          //leafletData.getMap().then(function(map) {
          //  var myLayer = L.geoJson(geoJson).addTo(map);
          //});
          //archMap.displayGeoJson(geoJson, map);
          //debugger;


          //myLayer.addData(geoJson);
        }
      }
    };
  });
