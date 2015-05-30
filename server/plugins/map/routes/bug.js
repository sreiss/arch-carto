module.exports = function(bugController, bugRouter, bugValidatorMiddleware, validationGateMiddleware) {

    bugRouter.route('/')
        .get(bugController.getList)
        .post(bugValidatorMiddleware.validateSaveBug, validationGateMiddleware, bugController.save);

    bugRouter.route('/:id')
        .delete(bugController.delete)
        .get(bugValidatorMiddleware.validateGetBug, validationGateMiddleware, bugController.get);

    /*
    bugSocket({
        save: bugController.io.save
    });
    */
};