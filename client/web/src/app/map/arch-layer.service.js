'use strict'
angular.module('archCarto')
  .service('archLayerService', function() {
    var _options = {};
    var _layers = {};
    var _layerItems = {};

    return {
      initOptions: function(name, options) {
        options = options || {};
        options.withIcon = options.withIcon || true;
        options.markerColors = options.markerColors || {};
        options.popupDirective = options.popupDirective || false;

        _options[name] = options;
      },
      initLayer: function(name) {
        _layers[name] = L.featureGroup();
        _layerItems[name] = {};

        return _layers[name];
      },
      addLayers: function(layerName, optionsName, layers, optionsOverrides) {
        var options = _options[optionsName];
        if (optionsOverrides) {
          var options = angular.extend(options, optionsOverrides);
        }
        L.geoJson(layers, {
          onEachFeature: function(feature, layer) {
            if (feature._id) {
              var currentLayer = _layers[layerName];
              if (_layerItems[layerName][optionsName] && _layerItems[layerName][optionsName][currentLayer._id]) {
                debugger;
              }
            }
            if (options.icon) {
              var iconOptions = {
                icon: options.icon
              };

              if (feature.properties.auditEvents[0].type == 'AWAITING_ADDITION') {
                iconOptions.markerColor = options.markerColors[feature.properties.auditEvents[0].type] || 'purple';
              } else if (feature.properties.auditEvents[0].type == 'AWAITING_UPDATE') {
                iconOptions.markerColor = options.markerColors[feature.properties.auditEvents[0].type] || 'blue';
              } else if (feature.properties.auditEvents[0].type == 'AWAITING_DELETE') {
                iconOptions.markerColor = options.markerColors[feature.properties.auditEvents[0].type] || 'red';
              } else if (feature.properties.auditEvents[0].type == 'ADDED') {
                iconOptions.markerColor = options.markerColors[feature.properties.auditEvents[0].type] || 'green';
              } else if (feature.properties.auditEvents[0].type == 'UPDATED') {
                iconOptions.markerColor = options.markerColors[feature.properties.auditEvents[0].type] || 'green';
              }

              layer.options.icon = L.AwesomeMarkers.icon(iconOptions);
            }

            if (feature.properties && options.popupDirective) {
              var html = angular.element('<' + options.popupDirective + '><' + options.popupDirective + '/>');
              layer.bindPopup(html[0], {
                archFeature: {
                  id: feature._id,
                  type: name
                },
                maxWidth: 600,
                minWidth: 600,
                className: 'arch-popup'
              });
            }

            _layerItems[layerName][optionsName] = _layerItems[layerName][optionsName] || {};
            _layerItems[layerName][optionsName][feature._id] = _layers[layerName].addLayer(layer);
          }
        });
      }
    };
  });
