module.exports = function(courseService, crudControllerFactory) {

    return crudControllerFactory.extend('COURSE', courseService, {
        saveFavorite: function (req, res, next) {
            courseService.saveFavorite(req.body.id, req.user._id)
                .then(function() {
                    res.json({
                        message: 'FAVORITE_COURSE_SAVED'
                    });
                })
                .catch(function(err) {
                    next(err);
                });
        },
        getFavoriteList: function(req, res, next) {
            courseService.getFavoriteList(req.params.userId)
                .then(function(favorites) {
                    res.json({
                        message: 'USER_FAVORITES_COURSES_LIST',
                        value: favorites
                    });
                })
                .catch(function(err) {
                    next(err);
                });
        },
        deleteFavorite: function(req, res, next) {
            courseService.deleteFavorite(req.params.id, req.user._id)
                .then(function(deleteFavorite) {
                    res.json({
                        message: 'USER_FAVORITE_DELETED',
                        value: deleteFavorite
                    });
                })
                .catch(function(err) {
                    next(err);
                });
        }
    });
};