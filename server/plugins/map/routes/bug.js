module.exports = function(bugController, bugRouter, bugValidatorMiddleware, validationGateMiddleware, bugSocket) {

    bugRouter.route('/')
        .get(bugController.getBugList)
        .post(bugValidatorMiddleware.validateSaveBug, validationGateMiddleware, bugController.saveBug);

    bugRouter.route('/:id')
        .get(bugValidatorMiddleware.validateGetBug, validationGateMiddleware, bugController.getBug);

    bugSocket({
        save: bugController.ws.save
    });
};