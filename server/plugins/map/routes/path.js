module.exports = function(pathController, pathRouter, pathValidatorMiddleware, validationGateMiddleware, authMiddleware)
{
    pathRouter.route('/')
        .get(pathController.getList)
        .post(authMiddleware.authenticate)
        .post(pathValidatorMiddleware.validateSave, validationGateMiddleware, pathController.save);

    pathRouter.route('/:id')
        .get(pathController.get);
};