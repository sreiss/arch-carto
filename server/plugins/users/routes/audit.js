module.exports = function (auditController, auditRouter, authMiddleware) {

    auditRouter.route('/')
        .get(authMiddleware.authenticate, auditController.getList);

};