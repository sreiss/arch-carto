module.exports = function(pathController, pathRouter, pathValidatorMiddleware, validationGateMiddleware) {

    pathRouter.route('/')
        .get(pathController.getList)
        .post(pathValidatorMiddleware.validateSave, validationGateMiddleware, pathController.save);

    pathRouter.route('/:id')
        .get(pathController.get);

};