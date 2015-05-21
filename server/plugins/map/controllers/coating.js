module.exports = function(coatingService) {

    return {
        getList: function(req, res, next) {
            coatingService.getList()
                .then(function(coatings) {
                    res.json({
                        message: 'COATING_LIST',
                        value: coatings
                    });
                })
                .catch(function(err) {
                   next(err);
                });
        },
        save: function(req, res, next) {
            coatingService.save(req.body)
                .then(function(savedCoating) {
                    res.json({
                        message: 'COATING_SAVED',
                        value: savedCoating
                    });
                })
                .catch(function(err) {
                    next(err);
                });
        }
    };

};