module.exports = function() {

    return {
        validateSave: function(req, res, next) {
            req.checkBody('properties.medias', 'MEDIAS_INVALID')
                .optional()
                .toObjectIds();

            return next();
        }
    };

};