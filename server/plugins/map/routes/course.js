module.exports = function(courseController, courseRouter) {

    courseRouter.route('/')
        .post(courseController.save)
        .get(courseController.getList);

    courseRouter.route('/:id')
        .get(courseController.get);

    /*
    courseSocket({
       save: courseController.io.save
    });
    */

};

