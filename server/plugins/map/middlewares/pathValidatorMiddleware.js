module.exports = function() {

    return {
        validateSave: function(req, res, next) {
            /*
            req.checkBody('properties.medias', 'MEDIAS_INVALID')
                .optional()
                .toObjectIds();

            req.checkBody('properties.coating', 'INVALID_COATING')
                .optional()
                .toObjectId();
                */

            return next();
        }
    };

};