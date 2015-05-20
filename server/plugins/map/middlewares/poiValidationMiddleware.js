module.exports = function() {

    return {
        validateSavePoi: function(req, res, next) {
            req.checkBody('properties', 'PROPERTIES_REQUIRED')
                .notEmpty();

            req.checkBody('properties.type', 'GEOJSON_TYPE_REQUIRED')
                .notEmpty()
                .isObjectId();

            /*req.checkBody('properties.altitude', 'ALTITUDE_MUST_BE_NUMERIC')
                .notEmpty()
                .isNumeric();*/

            req.checkBody('properties.name', 'NAME_REQUIRED')
                .notEmpty();

            req.checkBody('properties.name', 'NAME_MUST_BE_ALPHANUMERIC')
                .toString();

            req.checkBody('properties.description', 'DESCRIPTION_MUST_BE_STRING')
                .optional()
                .notEmpty()
                .toString();

            req.checkBody('geometry', 'GEOMETRY_REQUIRED')
                .notEmpty();

            //req.checkBody('geometry.type', 'GEOMETRY_TYPE_MUST_BE_ALPHANUMERICAL')
            //    .isAlpha();

            return next();
        }
    };

};