'use strict';
/**
 * Associe à chaque layerType la clé correspondante dans l'objet layers destiné à leaflet directive.
 */
angular.module('archCarto')
  .constant('ARCH_LAYER_TYPES', {
    baselayer: 'baselayers',
    overlay: 'overlays'
  });
