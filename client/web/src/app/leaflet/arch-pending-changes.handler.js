/**
 * Leaflet handler destined to store pending changes for the map.
 */

if (!L) {
  throw new Error('Please include Leaflet to use this plugin');
}

L.Map.ArchPendingChanges = L.Handler.extend({
  initialize: function(map) {
    this._map = map;
    this._changes = [];
  },

  getChanges: function() {
    return this._changes;
  },

  addHooks: function() {
    this._map.on('arch:pushchange', this._onPushChange, this);
    this._map.on('arch:popchange', this._onPopChange, this);
  },

  removeHooks: function() {
    this._map.off('arch:pushchange', this._onPushChange, this);
    this._map.off('arch:popchange', this._onPopChange, this);
  },

  _onPushChange: function(e) {
    var change = e.change;

    this._changes.push(change);
  },

  _onPopChange: function(e) {
    var change = e.change;

    this._changes.remove(change);
  }
});
