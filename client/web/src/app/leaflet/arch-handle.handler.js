/**
 * Leaflet handler to attach a hover and click event on junctions
 */

if (!L) {
  throw new Error('Please include Leaflet to use this plugin');
}

L.Handler.ArchHandle = L.Handler.extend({
  initialize: function (junction, mouseMarker, map, paths, options) {
    this._junction = junction;
    this._mouseMarker = mouseMarker;
    this._map = map;
    this._paths = paths;

    this._options = options || {};
    this._options.overOpacity = this._options.overOpacity || 1;
    this._options.outOpacity = this._options.outOpacity || 0.5;
  },

  addHooks: function() {
    this._junction.setOpacity(this._options.outOpacity);
    this._mouseMarker.on('snap', this._onSnap, this);
    this._mouseMarker.on('unsnap', this._onUnSnap, this);
  },

  removeHooks: function() {
    this._junction.setOpacity(this._options.overOpacity);
    this._mouseMarker.off('snap', this._onSnap, this);
    this._mouseMarker.off('unsnap', this._onUnSnap, this);
  },

  _onSnap: function(e) {
    if (e.layer === this._junction) {
      this._junction.setOpacity(this._options.overOpacity);
    }
  },

  _onUnSnap: function(e) {
    if (e.layer === this._junction) {
      this._junction.setOpacity(this._options.outOpacity);
    }
  },

  _onSnapClick: function(e) {
    console.log('ok');
  }
});
