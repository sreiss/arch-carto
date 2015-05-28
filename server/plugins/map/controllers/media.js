module.exports = function(mediaService) {

    return {
        save: function(req, res, next) {
            mediaService.save({
                    files: req.files,
                    body: req.body
                })
                .then(function(media) {
                    res.json({
                        message: 'MEDIA_SAVED',
                        value: media
                    });
                })
                .catch(function(err) {
                    next(err);
                });
        }
    };

};