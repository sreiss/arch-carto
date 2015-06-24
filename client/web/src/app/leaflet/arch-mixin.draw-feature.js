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

  _getAllLayers: function() {
    return this.options.archReferenceLayer.editable.getLayers()
      .add(this.options.archReferenceLayer.notEditable.getLayers())
  },

  _extractJunctions: function() {
    return this._getAllLayers()
      .filter(function(item) {
        return item instanceof L.Marker;
      });
  },

  _extractPaths: function() {
    return this._getAllLayers()
      .filter(function(item) {
        return item instanceof L.Polyline;
      });
  },

  _archOnEnabled: function(e) {
    var self = this;

    if (!this.options.archReferenceLayer) {
      console.log('[L.Draw.Feature.ArchMixin]: Please provide a reference layer to enable intersections and junctions features.');
    } else {
      this._archJunction = new L.Handler.ArchJunction(this._map, this._mouseMarker);
      this._archJunction.enable();

      if (this.options.archReferenceLayer) {
        var paths = self._extractPaths();
        var markers = self._extractJunctions();

        markers.each(function (marker) {
          marker.archHandler = new L.Handler.ArchHandle(marker, self._mouseMarker, self._map, paths);
          marker.archHandler.enable();
        });
      }
    }
  },

  _archOnDisabled: function(e) {

  },

  _fireCreatedEvent: function (layer) {
    if (this.options.archReferenceLayer) {
      layer.archIntersection = new L.Handler.ArchIntersection(layer, this._map, this.options.archReferenceLayer);
      layer.archIntersection.enable();
    }
    this._map.fire('draw:created', { layer: layer, layerType: this.type  });
  }
};

L.Draw.Polyline.ArchMixin = {
  _onMouseDown: function (e) {
    var originalEvent = e.originalEvent;
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;
    this._mouseDownOrigin = L.point(originalEvent.clientX, originalEvent.clientY);
    this._map.fire('draw:clicked', { lat: lat, lng: lng });
  }
};

L.Draw.Polyline.include(L.Draw.Polyline.ArchMixin);
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
