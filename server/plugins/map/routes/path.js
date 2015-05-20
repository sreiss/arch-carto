module.exports = function(pathController, pathRouter) {

    pathRouter.route('/')
        .get(pathController.getList)
        .post(pathController.save);

    pathRouter.route('/:id')
        .get(pathController.get);

};