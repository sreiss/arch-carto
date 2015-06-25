var multiparty = require('connect-multiparty')();

module.exports = function(mediaController, mediaRouter, authMiddleware)
{
    mediaRouter.route('/')
        //.post(authMiddleware.authenticate)
        .post(multiparty, mediaController.save);
};