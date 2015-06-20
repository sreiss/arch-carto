module.exports = function(junctionController, junctionRouter, authMiddleware)
{
    junctionRouter.route('/')
        .get(junctionController.getList)
        .post(authMiddleware.authenticate)
        .post(junctionController.save);
};