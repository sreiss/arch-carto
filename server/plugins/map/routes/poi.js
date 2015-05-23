module.exports = function(poiController, poiRouter, poiValidationMiddleware, validationGateMiddleware, poiSocket) {

    poiRouter.route('/')
        .get(poiController.getPoi)
        .post(poiValidationMiddleware.validateSavePoi, validationGateMiddleware, poiController.savePoi);

    poiRouter.route('/:id')
        .get(poiController.getPoi)
        .delete(poiController.deletePoi);

    poiSocket({
        save: poiController.ws.save
    });
};