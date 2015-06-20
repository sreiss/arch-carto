module.exports = function(ratingController, ratingRouter, authMiddleware)
{
    ratingRouter.route('/')
        .get(ratingController.getList)
        .post(authMiddleware.authenticate)
        .post(ratingController.save);

    ratingRouter.route('/:id')
        .get(ratingController.get);
};