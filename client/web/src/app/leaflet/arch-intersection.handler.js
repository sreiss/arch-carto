if (!L) {
  throw new Error('Please include Leaflet to use this plugin');
}

L.Handler.ArchIntersection = L.Handler.extend({
  initialize: function(layer, map, referenceLayer) {
    this._layer = layer;
    this._map = map;
    this._referenceLayer = referenceLayer;
    this._intersections = [];
  },

  addHooks: function() {
    //this._map.on('click', this._onClick, this);
    this._findIntersections();
  },

  removeHooks: function() {
    //this._map.fire('arch:intersectionsfound', this._intersections);
    //this._map.off('click', this._onClick, this);
  },

  getIntersections: function() {
    return this._intersections;
  },

  _findIntersections: function() {
  //_onMove: function() {
    var self = this;

    var allPaths = [];

    /*
    if (self._referenceLayer) {
      var layers = self._referenceLayer.editable.getLayers();
      layers.forEach(function (layer) {
        var layerLatLngs = self._layer.getLatLngs();
        var foundLayer = layerLatLngs.find(function (l) {
          return l.lat === layer.lat && l.lng === layer.lng;
        });
        if (layer.getLatLngs && !foundLayer) {
          var latLngs = layer.getLatLngs();
          allPaths.push(latLngs);
        }
      });
    }
    allPaths.push(this._layer.getLatLngs());

    var currentLayerCoords = this._layer.getLatLngs();
    */
    var allPaths = [];
    if (self._referenceLayer) {
      allPaths.add(self._referenceLayer.editable.getLayers());
    }
    //allPaths.add(self._layer);

    // Initial fetching of the current coordinates
    var currentLayerCoords;
    var pathLayerCoords;

    var intersections = [];
    allPaths.forEach(function(path) {
      if (path.getLatLngs) {
        currentLayerCoords = self._layer.getLatLngs();
        pathLayerCoords = path.getLatLngs();

        for (var i = 0; i < currentLayerCoords.length - 1; i += 1) {
          for (var j = 0; j < pathLayerCoords.length - 1; j += 1) {

            var intersection = self._computeIntersection(
              currentLayerCoords[i].lat, currentLayerCoords[i].lng,
              currentLayerCoords[i + 1].lat, currentLayerCoords[i + 1].lng,
              pathLayerCoords[j].lat, pathLayerCoords[j].lng,
              pathLayerCoords[j + 1].lat, pathLayerCoords[j + 1].lng
            );

            if (intersection !== null) {
              intersections.push({
                lat: intersection.lat,
                lng: intersection.lng,
                _path: path,
                _pathIndex: j + 1,
                _currentPathIndex: i + 1
              });
            }
          }
        }
      }
    });

    var markersFilter = function(layer) {
      return layer.getLatLng;
    };

    // Cleans the intersections from null values.
    intersections = intersections.compact(true);

    // Retrieves only markers from the reference layer.
    var allLayers = this._referenceLayer.editable.getLayers().filter(markersFilter);
    allLayers.add(this._referenceLayer.notEditable.getLayers().filter(markersFilter));

    // Formats the layers to be used with geolib.
    var geolibLayers = [];
    allLayers.each(function(layer) {
      var latLng = layer.getLatLng();
      geolibLayers.push(self._toLatLon(latLng, {
        layer: layer
      }));
    });

    for (var i = 0; i < intersections.length; i += 1) {
      var junction;
      var nearest = geolib.findNearest(self._toLatLon(intersections[i]), geolibLayers, 0, 1);

      // The junction either already exists or will be created.
      if (nearest.distance < 15) {
        var nearestJunction = geolibLayers[nearest.key].layer;
        junction = nearestJunction;

        // We replace the current intersection coordinates with the junction's ones.
        var latLng = nearestJunction.getLatLng();
        intersections[i].lat = latLng.lat;
        intersections[i].lng = latLng.lng;
      } else {
        junction = L.marker(L.latLng(intersections[i].lat, intersections[i].lng));
      }

      var paths = [];
      // Adjust paths
      self._layer._latlngs.add(junction.getLatLng(), intersections[i]._currentPathIndex);
      paths.push(self._layer._latlngs.slice(0, intersections[i]._currentPathIndex));
      paths.push(self._layer._latlngs.slice(intersections[i]._currentPathIndex));
      paths[0].add(junction.getLatLng());

      intersections[i]._path._latlngs.add(junction.getLatLng(), intersections[i]._pathIndex);
      paths.push(intersections[i]._path._latlngs.slice(0, intersections[i]._pathIndex));
      paths.push(intersections[i]._path._latlngs.slice(intersections[i]._pathIndex));
      paths[2].add(junction.getLatLng());

      // Integrity test
      console.log(paths[0][paths[0].length - 1].lng === paths[1][0].lng);
      console.log(paths[2][paths[2].length - 1].lng === paths[3][0].lng);

      intersections[i].junction = junction;
      intersections[i].paths = paths;
    }

    // For debug
    intersections.each(function(intersection) {
      self._map.addLayer(new L.Marker(intersection))
    });

    this._intersections = this._intersections.add(intersections);
  },

  _toLatLon: function(latLng, properties) {
    var latLon = {
      latitude: latLng.lat,
      longitude: latLng.lng
    };
    if (!!properties) {
      for (var key in properties) {
        latLon[key] = properties[key];
      }
    }
    return latLon;
  },

  _computeIntersection: function(lat1, lng1, lat2, lng2, lat3, lng3, lat4, lng4) {
    var d = (lat1 - lat2) * (lng3 - lng4) - (lng1 - lng2) * (lat3 - lat4);

    if (d == 0) {
      return null;
    }

    var lat = ((lat3 - lat4) * (lat1 * lng2 - lng1 * lat2) - (lat1 - lat2) * (lat3 * lng4 - lng3 * lat4)) / d;
    var lng = ((lng3 - lng4) * (lat1 * lng2 - lng1 * lat2) - (lng1 - lng2) * (lat3 * lng4 - lng3 * lat4)) / d;

    var p = new L.LatLng(lat, lng);

    if (lat < Math.min(lat1, lat2) || lat > Math.max(lat1, lat2)) {
      return null;
    }
    if (lat < Math.min(lat3, lat4) || lat > Math.max(lat3, lat4)) {
      return null;
    }

    return p;
  }
});
