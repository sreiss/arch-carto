if (!L) {
  throw new Error('Please include Leaflet to use this plugin');
}

if (!L.Draw || !L.Edit) {
  throw new Error('Please include Leaflet draw to use this plugin');
}

L.Draw.Feature.ArchMixin = {
  archInitialize: function() {
    this.on('enabled', this._archOnEnabled, this);
    this.on('disabled', this._archOnDisabled, this);
  },

  _archOnEnabled: function(e) {
    if (!this.options.archReferenceLayer) {
      console.log('[L.Draw.Feature.ArchMixin]: Please provide a reference layer to enable intersections and junctions features.');
    } else if (!this.options.archIntersections) {
      console.log('[L.Draw.Feature.ArchMixin]: Please provide an empty array to retrieve the found intersections.');
    } else {
      this._map.on('layeradd', this._archOnLayerAdd, this);
      this._archJunction = new L.Handler.ArchJunction(this._map, this._mouseMarker, this.options.archReferenceLayer);
      this._archJunction.enable();
    }
  },

  _archOnDisabled: function(e) {
    this._map.off('layeradd', this._archOnLayerAdd, this);
  },

  _archOnLayerAdd: function(e) {
    var self = this;
    var layer = e.layer;
    // To check if it is a polyline
    if (layer && layer.getLatLngs && layer.editing) {
      layer.archIntersection = new L.Handler.ArchIntersection(layer, self._map, this.options.archReferenceLayer, this.options.archIntersections);
      layer.archIntersection.enable();
    } else {
      //if (!this._map.archJunction.enabled()) {
      //  this._map.archJunction.enable();
      //}
    }
    /*
     else {
     layer.archJunction = new L.Handler.ArchJunction(layer, self._map);
     layer.archJunction.enable();
     }
     */
  }
};

L.Draw.Feature.include(L.Draw.Feature.ArchMixin);
L.Draw.Feature.addInitHook('archInitialize');

/*L.Edit.Poly.extend({
  initialize: function (map, poly, options) {
    L.Edit.Poly.prototype.initialize.call(this, poly, options);
  },

  _createMarker: function (latlng, index) {
    var marker = L.Edit.Poly.prototype._createMarker.call(this, latlng, index);

    // Treat middle markers differently
    var isMiddle = index === undefined;
    if (isMiddle) {
      // Snap middle markers, only once they were touched
      marker.on('dragstart', this._archOnDragStart, this);
    }
    else {
      this._archOnDragStart(marker);
    }
    return marker;
  },

  _archOnDragStart: function(e) {
    console.log('dragged');
  }
});*/