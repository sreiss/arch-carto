module.exports = function(courseController, courseRouter) {

    courseRouter.route('/')
        .post(courseController.save)
        .get(courseController.getList);

    courseRouter.route('/favorite/:userId')
        .get(courseController.getFavoriteList);

    courseRouter.route('/favorite')
        .post(courseController.saveFavorite);

    courseRouter.route('/:id')
        .get(courseController.get);
};

