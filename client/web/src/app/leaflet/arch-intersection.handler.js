if (!L) {
  throw new Error('Please include Leaflet to use this plugin');
}

L.Handler.ArchIntersection = L.Handler.extend({
  initialize: function(layer, map, referenceLayer, intersections) {
    this._layer = layer;
    this._map = map;
    this._referenceLayer = referenceLayer;
    this._intersections = intersections;
  },

  addHooks: function() {
    this._map.on('click', this._onClick, this);
  },

  removeHooks: function() {
    this._map.fire('arch:intersectionsfound', this._intersections);
    this._map.off('click', this._onClick, this);
  },

  _onClick: function() {
    var self = this;

    var layers = self._referenceLayer.editable.getLayers();
    var allPaths = [];

    layers.forEach(function(layer) {
      if (layer.getLatLngs) {
        var latLngs = layer.getLatLngs();
        allPaths.push(latLngs);
      }
    });

    var currentLayerCoords = this._layer.getLatLngs();

    var intersections = [];
    allPaths.forEach(function(path) {
      for (var i = 0; i < currentLayerCoords.length - 1; i += 1) {
        for (var j = 0; j < path.length - 1; j += 1) {
          intersections.push(self._computeIntersection(
            currentLayerCoords[i].lat, currentLayerCoords[i].lng,
            currentLayerCoords[i + 1].lat, currentLayerCoords[i + 1].lng,
            path[j].lat, path[j].lng,
            path[j + 1].lat, path[j + 1].lng
          ));
        }
      }
    });

    intersections = intersections.compact(true);
    this._intersections = this._intersections.concat(intersections);
  },

  _computeIntersection: function(x1, y1, x2, y2, x3, y3, x4, y4) {
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
  }
});
