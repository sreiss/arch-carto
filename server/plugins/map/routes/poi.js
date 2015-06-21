module.exports = function(poiController, poiRouter, poiValidationMiddleware, validationGateMiddleware, authMiddleware)
{
    poiRouter.route('/')
        .get(poiController.getList)
        .post(authMiddleware.authenticate, poiValidationMiddleware.validateSavePoi, validationGateMiddleware, poiController.save);

    poiRouter.route('/:id')
        .get(poiController.get)
        .delete(authMiddleware.authenticate)
        .delete(poiController.delete);
};