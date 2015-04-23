'use strict'
angular.module('archCarto')
  .factory('archMapControlService', function($q) {
    var _controls = {};

    return {
      getControls: function() {
        return $q.when(_controls);
      },
      registerControl: function(controlName) {
        return $q.when(_controls[controlName]);
      },
      /**
       * Ajoute les contrôles donnés en paramètre à la carte.
       * @param {Array} controlNames Le tableau du nom des contrôles à ajouter.
       * @returns {*}
       */
      registerControls: function(controls, type) {
        if (type) {
          return $q.when(angular.extend(_controls[type], controls));
        }
        return $q.when(angular.extend(_controls, controls));
      }
    };
  });
