module.exports = function(bugController, bugRouter, bugValidatorMiddleware, validationGateMiddleware, authMiddleware)
{
    bugRouter.route('/')
        .get(bugController.getList)
        .post(bugValidatorMiddleware.validateSaveBug, validationGateMiddleware, bugController.save);

    bugRouter.route('/:id')
        .delete(authMiddleware.authenticate)
        .delete(bugController.delete)
        .get(bugValidatorMiddleware.validateGetBug, validationGateMiddleware, bugController.get);
};