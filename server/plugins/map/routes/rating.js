module.exports = function(ratingController, ratingRouter) {

    ratingRouter.route('/')
        .get(ratingController.getList)
        .post(ratingController.save);

    ratingRouter.route('/:id')
        .get(ratingController.get);

    /*
    ratingSocket({
        save: ratingController.io.save
    });
    */

};