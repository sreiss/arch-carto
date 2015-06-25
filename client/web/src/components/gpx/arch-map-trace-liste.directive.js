'use strict'
angular.module('archCarto')
  .config(['$compileProvider',
    function ($compileProvider) {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
    }])
  .directive('archMapTraceList', function(archGpxService, $mdToast, $translate,archGpxUploadService, archInfoService, archLayerService) {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/gpx/arch-map-trace-list.html',
      controller: function($scope) {
        archGpxService.getTrace()
          .then(function(traces) {
            $scope.traces = traces;
            //console.log(JSON.stringify(traces));
          });
        $scope.$on('upload', function(){
          archGpxService.getTrace()
            .then(function(traces) {
              $scope.traces = traces;
              console.log(JSON.stringify(traces));
            });
        });

        $scope.downloadPdf = function(trace) {
          $scope.$emit('download-start');
          //$http.get($attrs.url).then(function(response) {
          $scope.$emit('downloaded', trace);
          //});
        };
      },
      link: function(scope, element, attributes, archMap) {

        //download
        scope.linkDownload = function(geoJson){
          var blob = new Blob([ togpx(geoJson) ], { type : 'text/plain' });
          scope.url = (window.URL || window.webkitURL).createObjectURL( blob );
        }



        //debugger;
        scope.displayTrace = function(geoJson){

          if(archMap.removeControl('el'))
          {
            archMap.removeControl('el');
            archMap.drawElevation(geoJson);
            archMap.displayTrace(geoJson);
            //archLayerService.addLayers('elevation', 'path', geoJson);
          }
          else
          {
            archMap.drawElevation(geoJson);

          }
        }

        scope.editTrace = function(geoJson){
          archMap.removeControl('el');
          //var id = geoJson._id;
          //console.log(togpx(geoJson));
          //console.log("rawGeoJson"+JSON.stringify(geoJson));
          //archMap.getMap().then(function (map) {
          //  var featureGroup = L.featureGroup().addTo(map);
          //
          //  L.geoJson(geoJson, {
          //    onEachFeature: function (feature, layer) {
          //      featureGroup.addLayer(layer);
          //    }
          //  });
          //
          //
          //  var drawControl = new L.Control.Draw({
          //    draw: {
          //      circle: false,
          //      rectangle: false,
          //      marker: false,
          //      polygon: false
          //    },
          //    edit: {
          //      featureGroup: featureGroup
          //    }
          //  }).addTo(map);
          //
          //  map.on('draw:edited', function (e) {
          //    var layers = e.layers;
          //
          //    layers.eachLayer(function (layer) {
          //      //do whatever you want, most likely save back to db
          //      featureGroup.addLayer(layer);
          //      geoJson.features[0] = layer.toGeoJSON();
          //      console.log("new geojson"+ JSON.stringify(geoJson));
          //      //var newTrace = JSON.stringify(layer.toGeoJSON());
          //      //console.log(JSON.stringify(newTrace));
          //      archGpxUploadService.uploadFileToUrl(geoJson);
          //
          //    });
          //
          //  });
          //});
        }
      }
    };
  });
