'use strict'

angular.module('archCarto')
  .directive('archGpxUploadForm', ['$parse', function ($parse,$mdSidenav) {
    return {
      restrict: 'E',
      scope: {
        poi: '=?',
        formValid: '='
      },
      templateUrl: 'components/gpx/arch-upload-form.html',
      controller: function($scope, httpConstant ,archGpxUploadService,archHttpService, $mdSidenav) {
        $mdSidenav('right').toggle();
        $mdSidenav('right').open();
        // first version
        //var _gpxUrl = httpConstant.cartoServerUrl + '/map/gpx/';
        //console.log(_gpxUrl);
        //$scope.uploader = new FileUploader({
        //  removeAfterUpload: true,
        //  autoUpload: false,
        //  //withCredentials: true,
        //  queueLimit: 1
        //});
        //$scope.upload = function () {
        //  $scope.uploader.uploadAll();
        //};
        //$scope.uploader.onBeforeUploadItem = function (fileItem) {
        //  $scope.uploadError = null;
        //  fileItem.url = _gpxUrl;
        //  var reader = new FileReader();
        //  reader.readAsText(fileItem);
        //  console.log('NXM powaa' + fileItem);
        //  debugger;
        //  var gpx = toGeoJSON.gpx(fileItem);
        //  console.log(gpx);
        //};
        //
        //$scope.uploader.onAfterAddingFile = function () {
        //  $scope.uploadError = null;
        //};
        //
        //$scope.uploader.onErrorItem = function (fileItem) {
        //  $scope.uploadError = 'Error when uploading the file '+ fileItem.file.name + '.';
        //};
        //
        //$scope.uploader.onSuccessItem = function () {
        //};
        //$scope.isUploading = function () {
        //  return !_.isEmpty($scope.uploader.queue);
        //};

      },

      link: function(scope, element, attrs) {
        //second version
        //scope.i
        //console.log(attrs.$normalize);
        //scope.upload = archGpxUploadSer

      }
    };
  }])
  .directive('onReadFile', function ($parse,archGpxUploadService, archGpxService) {
    return {
      restrict: 'A',
      scope: false,
      link: function(scope, element, attrs) {
        var fn = $parse(attrs.onReadFile);


        //'use strict';
        //geojson part
        var removeSpace = (/\s*/g),
          trimSpace = (/^\s*|\s*$/g),
          splitSpace = (/\s+/);
        // generate a short, numeric hash of a string
        function okhash(x) {
          if (!x || !x.length) return 0;
          for (var i = 0, h = 0; i < x.length; i++) {
            h = ((h << 5) - h) + x.charCodeAt(i) | 0;
          } return h;
        }
        // all Y children of X
        function get(x, y) { return x.getElementsByTagName(y);  }
        function attr(x, y) { return x.getAttribute(y); }
        function attrf(x, y) { return parseFloat(attr(x, y)); }
        // one Y child of X, if any, otherwise null
        function get1(x, y) { var n = get(x, y); return n.length ? n[0] : null; }
        // https://developer.mozilla.org/en-US/docs/Web/API/Node.normalize
        function norm(el) { if (el.normalize) { el.normalize(); } return el; }
        // cast array x into numbers
        function numarray(x) {
          for (var j = 0, o = []; j < x.length; j++) { o[j] = parseFloat(x[j]); }
          return o;
        }
        function clean(x) {
          var o = {};
          for (var i in x) { if (x[i]) { o[i] = x[i]; } }
          return o;
        }
        // get the content of a text node, if any
        function nodeVal(x) {
          if (x) { norm(x); }
          return (x && x.firstChild && x.firstChild.nodeValue) || '';
        }
        // get one coordinate from a coordinate array, if any
        function coord1(v) { return numarray(v.replace(removeSpace, '').split(',')); }
        // get all coordinates from a coordinate array as [[],[]]
        function coord(v) {
          var coords = v.replace(trimSpace, '').split(splitSpace),
            o = [];
          for (var i = 0; i < coords.length; i++) {
            o.push(coord1(coords[i]));
          }
          return o;
        }
        function coordPair(x) {
          var ll = [attrf(x, 'lon'), attrf(x, 'lat')],
            ele = get1(x, 'ele'),
          // handle namespaced attribute in browser
            heartRate = get1(x, 'gpxtpx:hr') || get1(x, 'hr'),
            time = get1(x, 'time'),
            e;
          if (ele) {
            e = parseFloat(nodeVal(ele));
            if (e) {
              ll.push(e);
            }
          }
          return {
            coordinates: ll,
            time: time ? nodeVal(time) : null,
            heartRate: heartRate ? parseFloat(nodeVal(heartRate)) : null
          };
        }

        // create a new feature collection parent object
        function fc() {
          return {
            type: 'FeatureCollection',
            features: []
          };
        }

        var serializer;
        if (typeof XMLSerializer !== 'undefined') {
          serializer = new XMLSerializer();
          // only require xmldom in a node environment
        } else if (typeof exports === 'object' && typeof process === 'object' && !process.browser) {
          serializer = new (require('xmldom').XMLSerializer)();
        }
        function xml2str(str) {
          // IE9 will create a new XMLSerializer but it'll crash immediately.
          if (str.xml !== undefined) return str.xml;
          return serializer.serializeToString(str);
        }
        function gpx(doc)
        {
          var parser=new DOMParser();
          var xmlDoc=parser.parseFromString(doc,"text/xml");
          //console.log(doc);
          //console.log(doc2);
          //var doc = loadXMLString('doc2');
          var i,
            tracks = get(xmlDoc, 'trk'),
            routes = get(xmlDoc, 'rte'),
            waypoints = get(xmlDoc, 'wpt'),
          // a feature collection
            gj = fc(),
            feature;
          for (i = 0; i < tracks.length; i++) {
            feature = getTrack(tracks[i]);
            if (feature) gj.features.push(feature);
          }
          for (i = 0; i < routes.length; i++) {
            feature = getRoute(routes[i]);
            if (feature) gj.features.push(feature);
          }
          for (i = 0; i < waypoints.length; i++) {
            gj.features.push(getPoint(waypoints[i]));
          }
          function getPoints(node, pointname) {
            var pts = get(node, pointname),
              line = [],
              times = [],
              heartRates = [],
              l = pts.length;
            if (l < 2) return {};  // Invalid line in GeoJSON
            for (var i = 0; i < l; i++) {
              var c = coordPair(pts[i]);
              line.push(c.coordinates);
              if (c.time) times.push(c.time);
              if (c.heartRate) heartRates.push(c.heartRate);
            }
            return {
              line: line,
              times: times,
              heartRates: heartRates
            };
          }
          function getTrack(node) {
            var segments = get(node, 'trkseg'),
              track = [],
              times = [],
              heartRates = [],
              line;
            for (var i = 0; i < segments.length; i++) {
              line = getPoints(segments[i], 'trkpt');
              if (line.line) track.push(line.line);
              if (line.times && line.times.length) times.push(line.times);
              if (line.heartRates && line.heartRates.length) heartRates.push(line.heartRates);
            }
            if (track.length === 0) return;
            var properties = getProperties(node);
            if (times.length) properties.coordTimes = track.length === 1 ? times[0] : times;
            if (heartRates.length) properties.heartRates = track.length === 1 ? heartRates[0] : heartRates;
            return {
              type: 'Feature',
              properties: properties,
              geometry: {
                type: track.length === 1 ? 'LineString' : 'MultiLineString',
                coordinates: track.length === 1 ? track[0] : track
              }
            };
          }
          function getRoute(node) {
            var line = getPoints(node, 'rtept');
            if (!line) return;
            var routeObj = {
              type: 'Feature',
              properties: getProperties(node),
              geometry: {
                type: 'LineString',
                coordinates: line
              }
            };
            if (line.times.length) routeObj.geometry.times = line.times;
            return routeObj;
          }
          function getPoint(node) {
            var prop = getProperties(node);
            prop.sym = nodeVal(get1(node, 'sym'));
            return {
              type: 'Feature',
              properties: prop,
              geometry: {
                type: 'Point',
                coordinates: coordPair(node).coordinates
              }
            };
          }
          function getProperties(node) {
            var meta = ['name', 'desc', 'author', 'copyright', 'link',
                'time', 'keywords'],
              prop = {},
              k;
            for (k = 0; k < meta.length; k++) {
              prop[meta[k]] = nodeVal(get1(node, meta[k]));
            }
            return clean(prop);
          }
          return gj;
        };

        //return t;

        scope.geoJson = "";
        element.on('change', function(onChangeEvent) {
          var reader = new FileReader();

          reader.onload = function(onLoadEvent) {
            scope.$apply(function() {
              scope.geoJson = gpx(onLoadEvent.target.result);
              archGpxService.simplifyTrace(gpx(onLoadEvent.target.result)).then(function(simplified)
              {
                console.log(simplified);
                scope.geoJson.features[0].geometry.coordinates = simplified;
                console.log(scope.geoJson);
                //debugger;
              });
              //fn(scope, {$fileContent:geoJson});
              //console.log('I am in scope.$apply'+geoJson);
              //archGpxUploadService.uploadFileToUrl(geoJson);

            });
          };

          reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
        });
        scope.upload = function(){
          console.log(scope.geoJson);
          //debugger;
          archGpxUploadService.uploadFileToUrl(scope.geoJson);
        }
      }
    };
  });

