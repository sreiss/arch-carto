module.exports = function(poiController, poiRouter, poiValidationMiddleware, validationGateMiddleware, authMiddleware)
{
    poiRouter.route('/')
        .get(poiController.getPoi)
        .post(poiValidationMiddleware.validateSavePoi, validationGateMiddleware, poiController.savePoi);

    poiRouter.route('/:id')
        .get(poiController.getPoi)
        .delete(authMiddleware.authenticate)
        .delete(poiController.deletePoi);
};