module.exports = function(courseController, courseRouter, authMiddleware)
{
    courseRouter.route('/')
        .post(authMiddleware.authenticate)
        .post(courseController.save)
        .get(courseController.getList);

    courseRouter.route('/favorite/:userId')
        .get(courseController.getFavoriteList);

    courseRouter.route('/favorite')
        .post(authMiddleware.authenticate)
        .post(courseController.saveFavorite);

    courseRouter.route('/:id')
        .get(courseController.get);
};

