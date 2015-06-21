if (!L) {
  throw new Error('Please include Leaflet to use this plugin');
}

// region ArchJunction
/**
 * A handler for the junctions. It permits to move junctions across the map and to keep the paths attached to it magnetised.
 */
L.Handler.ArchJunction = L.Handler.extend({
  initialize: function(map, marker) {
    this._map = map;
    this._marker = marker;
  },

  addHooks: function() {
    this._marker.on('move', this._onMove, this);
  },

  _onMove: function(e) {
  }
});
/*
L.Handler.ArchJunction = L.Handler.extend({
  initialize: function(map, marker, referenceLayer) {
    this._map = map;
    this._marker = marker;
    this._referenceLayer = referenceLayer;
  },

  addHooks: function() {
    this._marker.on('snap', this._onSnap, this);
  },

  removeHooks: function() {
    this._marker.off('snap', this._onSnap, this);
  },

  _onSnap: function(e) {
    var self = this;
    var layers = this._referenceLayer.editable.getLayers();
    var junctions = layers.filter(function(layer) {
      return layer instanceof L.Marker;
    });
    var closest = L.GeometryUtil.closestLayerSnap(this._map, junctions, e.latlng, 15);
    if (!!closest) {
      self._marker.setLatLng(closest.layer.getLatLng());
    }
  }
});
*/
