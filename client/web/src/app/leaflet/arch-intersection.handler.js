if (!L) {
  throw new Error('Please include Leaflet to use this plugin');
}

L.Handler.ArchIntersection = L.Handler.extend({
  initialize: function(layer, map, referenceLayer) {
    this._layer = layer;
    this._map = map;
    this._referenceLayer = referenceLayer;
  },

  addHooks: function() {
    var self = this;

    var layers = self._referenceLayer.editable.getLayers();
    var allPaths = [];

    layers.forEach(function(layer) {
      if (layer.getLatLngs) {
        var latLngs = layer.getLatLngs();
        allPaths.push(latLngs);
      }
    });

    var intersections = [];
    allPaths.forEach(function(path) {
      allPaths.forEach(function(pathToCompare) {
        if (pathToCompare != path) {
          for (var i = 0; i < path.length - 1; i += 1) {
            for (var j = 0; j < pathToCompare.length - 1; j += 1) {
              intersections.push(self._computeIntersection(
                path[i].lat, path[i].lng,
                path[i + 1].lat, path[i + 1].lng,
                pathToCompare[j].lat, pathToCompare[j].lng,
                pathToCompare[j + 1].lat, pathToCompare[j + 1].lng
              ));
            }
          }
        }
      })
    });

    intersections.forEach(function(intersection) {
      if (intersection) {
        self._map.addLayer(new L.Marker([intersection.lat, intersection.lon]));
      }
    });
    console.log(intersections);
    //var closest = L.GeometryUtil.closestLayerSnap(this._map, layers, this._layer.getLatLngs(), 100);
    //console.log(closest);
  },

  removeHooks: function() {

  },

  _computeIntersection: function(lat1, lng1, lat2, lng2, lat3, lng3, lat4, lng4) {
    var coords1 = new LatLon(lat1, lng1);
    var coords2 = new LatLon(lat2, lng2);
    var coords3 = new LatLon(lat3, lng3);
    var coords4 = new LatLon(lat4, lng4);

    var intersection = LatLon.intersection(coords1,
      coords1.bearingTo(coords2),
      coords3,
      coords3.bearingTo(coords4)
    );

    return intersection;
    /*
    var d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (d == 0) {
      return null;
    }

    var xi = ((x3 - x4) * (x1 * y2 - y1 * x2) - (x1 - x2) * (x3 * y4 - y3 * x4)) / d;
    var yi = ((y3 - y4) * (x1 * y2 - y1 * x2) - (y1 - y2) * (x3 * y4 - y3 * x4)) / d;

    var p = {x: xi, y: yi};

    if (xi < Math.min(x1, x2) || xi > Math.max(x1, x2)) {
      return null;
    }
    if (xi < Math.min(x3, x4) || xi > Math.max(x3, x4)) {
      return null;
    }

    return p;
    */
  }
});
