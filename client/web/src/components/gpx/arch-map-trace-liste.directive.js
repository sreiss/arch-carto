'use strict'
angular.module('archCarto')
  .directive('archMapTraceList', function(archGpxService, $mdToast, $translate,archGpxUploadService) {
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
          //archMap.displayElevation(geoJson);
//          //all used options are the default values
//          //var el = $scope.controls.Elevation;
//          console.log(geoJson);
            archMap.getMap().then(function (map) {
              //el.clear();
              //TO DO clear el to have only one chart
              //map.removeControl(el);
              var el = L.control.elevation({
                position: "bottomleft",
                theme: "steelblue-theme", //default: lime-theme
                width: 600,
                height: 125,
                margins: {
                  top: 10,
                  right: 20,
                  bottom: 30,
                  left: 50
                },
                useHeightIndicator: true, //if false a marker is drawn at map position
                interpolation: "linear", //see https://github.com/mbostock/d3/wiki/SVG-Shapes#wiki-area_interpolate
                hoverNumber: {
                  decimalsX: 3, //decimals on distance (always in km)
                  decimalsY: 0, //deciamls on height (always in m)
                  formatter: undefined //custom formatter function may be injected
                },
                xTicks: undefined, //number of ticks in x axis, calculated by default according to width
                yTicks: undefined, //number of ticks on y axis, calculated by default according to height
                collapsed: true    //collapsed mode, show chart on click or mouseover
              });
              //el.clearLayers();
              el.addTo(map);
              var layer = L.geoJson(geoJson, {
                onEachFeature: el.addData.bind(el)
                //working on a better solution
              }).addTo(map);
              map.fitBounds(layer.getBounds());

            });
          //leafletData.getMap().then(function(map) {
          //  var myLayer = L.geoJson(geoJson).addTo(map);
          //});
          //archMap.displayGeoJson(geoJson, map);
          //debugger;


          //myLayer.addData(geoJson);
        }

        scope.editTrace = function(geoJson){
          var id = geoJson._id;
          console.log("rawGeoJson"+JSON.stringify(geoJson));
          archMap.getMap().then(function (map) {
          var featureGroup = L.featureGroup().addTo(map);

          L.geoJson(geoJson, {
            onEachFeature: function (feature, layer) {
              featureGroup.addLayer(layer);
            }
          });


          var drawControl = new L.Control.Draw({
            edit: {
              featureGroup: featureGroup
            }
          }).addTo(map);

            map.on('draw:edited', function (e) {
              var layers = e.layers;

              layers.eachLayer(function (layer) {
                //do whatever you want, most likely save back to db
                featureGroup.addLayer(layer);
                geoJson.features[0] = layer.toGeoJSON();
                console.log("new geojson"+ JSON.stringify(geoJson));
                //var newTrace = JSON.stringify(layer.toGeoJSON());
                //console.log(JSON.stringify(newTrace));
                archGpxUploadService.uploadFileToUrl(geoJson);

              });

            });
        });
        }
      }
    };
  });
