if (!L) {
  throw new Error('Please include Leaflet to use this plugin');
}

L.Handler.ArchIntersection = L.Handler.extend({
  initialize: function(layer, map, referenceLayer) {
    this._layer = layer;
    this._map = map;
    this._referenceLayer = referenceLayer;
    this._intersections = [];
    this._junctions = [];
    this._paths = [];
  },

  addHooks: function() {
    //this._map.on('click', this._onClick, this);
    this._findIntersections();
    this._findEndIntersections();
  },

  removeHooks: function() {
    //this._map.fire('arch:intersectionsfound', this._intersections);
    //this._map.off('click', this._onClick, this);
  },

  getIntersections: function() {
    return this._intersections;
  },

  _getAllLayers: function() {
    return this._referenceLayer.editable.getLayers()
      .add(this._referenceLayer.notEditable.getLayers());
  },

  _extractJunctions: function() {
    var layers = this._getAllLayers();
    return layers.filter(function(item) {
      return item instanceof L.Marker;
    });
  },

  /**
   * Call to refresh the reload the junctions, if the referenceLayer has changed for instance.
   */
  refreshJunctions: function() {
    var self = this;

    if (self._referenceLayer) {
      // Retrieves only markers from the reference layer.
      self._junctions = self._extractJunctions();
      // Extract the LatLng of every junction on the map to find the nearest one of every intersection.
      self._junctionLatLngs = [];
      self._junctions.forEach(function(junction) {
        self._junctionLatLngs.push(junction.getLatLng());
      });
    } else {
      throw new Error('Unable to refresh junctions, no reference layer was provided.');
    }

  },

  _extractPaths: function() {
    var layers = this._getAllLayers();
    return layers.filter(function(item) {
      return item instanceof L.Polyline;
    });
  },

  /**
   * Call to refresh the paths, if the referenceLayer has changed for instance.
   */
  refreshPaths: function() {
    var self = this;

    if (self._referenceLayer) {
      self._paths = self._extractPaths();
    } else {
      throw new Error('Unable to refresh paths, no referenceLayer was provided.');
    }
  },

  /**
   * Finds the nearest matching junction or creates a new one if none is found.
   * @private
   */
  _getCorrectJunction: function(latLng) {
    var junction;
    var closestLatLng = L.GeometryUtil.closest(this._map, this._junctionLatLngs, latLng, false);

    // The junction either already exists or will be created.
    if (!!closestLatLng && closestLatLng.distance > 1 && closestLatLng.distance < 15) {
      var closest;
      for (var i = 0; i < this._junctions.length; i += 1) {
        var junctionLatLng = this._junctions[i].getLatLng();
        if (closestLatLng.lat === junctionLatLng.lat && closestLatLng.lng === junctionLatLng.lng) {
          closest = this._junctions[i];
          break;
        }
      }
      junction = closest;
    } else {
      junction = L.marker(L.latLng(latLng.lat, latLng.lng));
    }

    return junction;
  },

  _findIntersections: function() {
  //_onMove: function() {
    var self = this;

    self.refreshJunctions();
    self.refreshPaths();

    // Initial fetching of the current coordinates
    var currentLayerCoords;
    var pathLayerCoords;

    var intersections = [];
    self._paths.forEach(function(path) {
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

    // Cleans the intersections from null values.
    intersections = intersections.compact(true);

    for (var i = 0; i < intersections.length; i += 1) {
      var junction = self._getCorrectJunction(intersections[i]);

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
      // console.log(paths[0][paths[0].length - 1].lng === paths[1][0].lng);
      // console.log(paths[2][paths[2].length - 1].lng === paths[3][0].lng);

      intersections[i].junction = junction;
      intersections[i].paths = paths;
    }

    this._intersections = this._intersections.add(intersections);
  },

  _findEndIntersections: function() {
    var self = this;
    var latLngs = self._layer.getLatLngs();

    var ends = [
      L.marker(latLngs[0]),
      L.marker(latLngs[latLngs.length - 1])
    ];

    ends.forEach(function(end) {
      var junction = self._getCorrectJunction(end.getLatLng());
      var junctionLatLng = junction.getLatLng();
      self._intersections.push({
        lat: junctionLatLng.lat,
        lng: junctionLatLng.lng,
        junction: junction,
        paths: [self._layer]
      });
    });
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
