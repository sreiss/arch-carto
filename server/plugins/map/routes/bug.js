module.exports = function(bugController, bugRouter, bugValidatorMiddleware, validationGateMiddleware) {

    bugRouter.route('/')
        .get(bugController.getBugList)
        .post(bugValidatorMiddleware.validateSaveBug, validationGateMiddleware, bugController.saveBug);

    bugRouter.route('/:id')
        .get(bugValidatorMiddleware.validateGetBug, validationGateMiddleware, bugController.getBug);

};