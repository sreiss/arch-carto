module.exports = function(mediaService) {

    return {
        save: function(req, res) {
            mediaService.save({
                    files: req.files,
                    body: req.body
                })
                .then(function(media) {
                    res.json(media);
                });
        }
    };

};