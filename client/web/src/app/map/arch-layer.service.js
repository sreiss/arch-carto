'use strict'
angular.module('archCarto')
  .service('archLayerService', function(archAuditService) {
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
        _layers[name] = {};
        _layers[name].editable = L.featureGroup();
        _layers[name].notEditable = L.featureGroup();
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
            var type;
            if (feature.properties.auditEvents.length > 0) {
              type = feature.properties.auditEvents[0].type || '';
            } else {
              type = 'AWAITING_ADDITION';
            }
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

              iconOptions.markerColor = options.markerColors[feature.properties.auditEvents[0].type]
                || archAuditService.getColor(type);

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
            if (archAuditService.isEditable(type)) {
              _layerItems[layerName][optionsName][feature._id] = _layers[layerName].editable.addLayer(layer);
            } else {
              _layerItems[layerName][optionsName][feature._id] = _layers[layerName].notEditable.addLayer(layer);
            }

            if (optionsOverrides.onEachFeature) {
              optionsOverrides.onEachFeature(feature, layer);
            }
          }
        });
      }
    };
  });
