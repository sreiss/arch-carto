module.exports = function() {

  return {
      validateSaveBug: function(req, res, next) {
          req.checkBody('type', 'GEOJSON_TYPE_REQUIRED').notEmpty();
          req.checkBody('properties', 'PROPERTIES_REQUIRED').notEmpty();
          req.checkBody('properties.altitude', 'ALTITUDE_MUST_BE_NUMERIC')
              .notEmpty()
              .isNumeric();
          req.checkBody('properties.description', 'DESCRIPTION_MUST_BE_STRING')
              .notEmpty()
              .isAlphanumeric();
          req.checkBody('properties.status', 'VALID_STATUS_REQUIRED')
              .notEmpty()
              .isObjectId();

          req.checkBody('geometry', 'GEOMETRY_REQUIRED').notEmpty();
          //req.checkBody('geometry.coordinates', 'GEOMETRY_TYPE_MUST_BE_ALPHANUMERICAL').isAlpha();
          return next();
      }
  };

};