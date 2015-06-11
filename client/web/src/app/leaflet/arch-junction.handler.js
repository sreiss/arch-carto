if (!L) {
  throw new Error('Please include Leaflet to use this plugin');
}

// region ArchJunction

L.Handler.ArchJunction = L.Handler.extend({
  initialize: function(map, marker, referenceLayer, options) {
    this._map = map;
    this._marker = marker;
    this._referenceLayer = referenceLayer;

    options = options || {};
    this._options = {
      magnetismDistance: options.magnetismeDistance || 5
    }
  },

  addHooks: function() {
    this._marker.on('move', this._onMove, this);
  },

  removeHooks: function() {
    this._marker.off('move', this._onMove, this);
  },

  _onMove: function(e) {
    var layers = this._referenceLayer.editable.getLayers();
    var closest = L.GeometryUtil.closestLayerSnap(this._map, layers, e.latlng, this._options.magnetismDistance);
    if (closest && closest.layer instanceof L.Marker) {
      closest.layer.on('click', function() {
        console.log('ok');
      });
      //this._marker.setLatLng(closest.latlng);
    }
  }
});
