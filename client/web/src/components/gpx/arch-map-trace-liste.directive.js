'use strict'
angular.module('archCarto')
  .config(['$compileProvider',
    function ($compileProvider) {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
    }])
  .directive('archMapTraceList', function(archGpxService, $mdToast, $translate,archGpxUploadService, archInfoService) {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/gpx/arch-map-trace-list.html',
      controller: function($scope) {
        archGpxService.getTrace()
          .then(function(traces) {
            $scope.traces = traces;
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
          //debugger;

          archInfoService.getDGeoJ(geoJson).then(function(distance){
            console.log(distance);
          });
          archInfoService.getDistanceGeoJ(geoJson).then(function(distance){
            console.log(distance);
          });
          //archInfoService.getD
          if(archMap.removeControl('el'))
          {
            archMap.removeControl('el');
            archMap.drawElevation(geoJson);
          }
          else
          {
            archMap.drawElevation(geoJson);

          }
          //archMap.getMap().then(function (map) {
          //TO DO clear el to have only one chart
          //map.removeControl(el);
          //var el = L.control.elevation({
          //  position: "bottomleft",
          //  theme: "steelblue-theme", //default: lime-theme
          //  width: 600,
          //  height: 125,
          //  margins: {
          //    top: 10,
          //    right: 20,
          //    bottom: 30,
          //    left: 50
          //  },
          //  useHeightIndicator: true, //if false a marker is drawn at map position
          //  interpolation: "linear", //see https://github.com/mbostock/d3/wiki/SVG-Shapes#wiki-area_interpolate
          //  hoverNumber: {
          //    decimalsX: 3, //decimals on distance (always in km)
          //    decimalsY: 0, //deciamls on height (always in m)
          //    formatter: undefined //custom formatter function may be injected
          //  },
          //  xTicks: undefined, //number of ticks in x axis, calculated by default according to width
          //  yTicks: undefined, //number of ticks on y axis, calculated by default according to height
          //  collapsed: true    //collapsed mode, show chart on click or mouseover
          //});
          //console.log(el);
          //debugger;
          ////el.clearLayers();
          //el.addTo(map);
          //var layer = L.geoJson(geoJson, {
          //  onEachFeature: el.addData.bind(el)
          //  //working on a better solution
          //}).addTo(map);
          //map.fitBounds(layer.getBounds());

          //});
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
