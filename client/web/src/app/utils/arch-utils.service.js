'use strict';
angular.module('archCarto')
  .factory('archUtilsService', function() {
    return {
      /**
       * Indique si l'objet ou le tableau passé en paramètre contient la valeur passée en second paramètre.
       * @param {mixed} obj Un tableau ou un objet.
       * @param {mixed} value La valeur à chercher.
       * @return {boolean} Vrai si la valeur a été trouvée, faux sinon.
       */
      contains: function(obj, value) {
        var result = false;
        if (Array.isArray(obj)) {
          result = (obj.indexOf(value) != -1);
        } else if (angular.isObject(obj)) {
          Object.keys(obj).map(function(key) {
            if (obj[key] === value) {
              result = true;
            }
          });
        }
        return result;
      }
    };
  });
