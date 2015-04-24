'use strict'
angular.module('archCarto')
  .factory('archMapControlService', function($q) {
    var _controls = {};

    return {
      getControls: function(type) {
        if (type && _controls[type]) {
          return $q.when(_controls[type]);
        } else if (type) {
          $q.reject(new Error('Control type ' + type + ' was not found.'));
        }
        return $q.when(_controls);
      },
      registerControl: function(control, type) {
        if (type && _controls[type]) {
          $q.when(angular.extend(_controls[type], control));
        }
        return $q.when(_controls, control);
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
