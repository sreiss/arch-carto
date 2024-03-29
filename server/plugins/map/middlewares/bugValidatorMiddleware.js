var Q = require('q');

module.exports = function(formatterService) {

  return {
      validateGetBug: function(req, res, next) {
          req.checkParams('id', 'ID_MUST_BE_OBJECT_ID')
              .notEmpty();

          return next();
      },
      validateSaveBug: function(req, res, next) {
          req.checkBody('properties', 'PROPERTIES_REQUIRED')
              .notEmpty();

          /*req.checkBody('properties.altitude', 'ALTITUDE_MUST_BE_NUMERIC')
              .notEmpty()
              .isNumeric();*/

          req.checkBody('properties.description', 'DESCRIPTION_MUST_BE_STRING')
              .notEmpty()
              .toString();

          req.checkBody('properties.status', 'VALID_STATUS_REQUIRED')
              .optional()
              .notEmpty();

          req.checkBody('geometry', 'GEOMETRY_REQUIRED')
              .notEmpty();

          return next();
      }
  };

};