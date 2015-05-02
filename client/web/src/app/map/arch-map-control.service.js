'use strict'
angular.module('archCarto')
  .factory('archMapControlService', function($q) {
    return {
      /**
       * Créer le control Leaftlet souhaité. Util pour créer des controles de navigation.
       * @param name
       * @param options
       * @returns {*}
       */
      createControlClass: function(name, cssName) {
        if (!L.Control[name]) {
          L.Control[name] = L.Control.extend({
            options: {
              position: 'topleft',
              clickFn: angular.noop
            },
            onAdd: function (map) {
              var control = L.DomUtil.create('div', 'arch-control-' + cssName);
              var bar = L.DomUtil.create('div', 'leaflet-bar arch-control-toolbar-' + cssName, control);

              var a = L.DomUtil.create('a', 'arch-control-' + cssName + '-a', bar);
              var clickFn = this.options.clickFn;
              L.DomEvent
                .addListener(a, 'click', L.DomEvent.stopPropagation)
                .addListener(a, 'click', L.DomEvent.preventDefault)
                .addListener(a, 'click', function () {
                  clickFn();
                });

              return control;
            }
          });
        }

        return L.Control[name];
      }
    };
  });
