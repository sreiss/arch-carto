var multiparty = require('connect-multiparty')();

module.exports = function(mediaController, mediaRouter) {

    mediaRouter.route('/')
        .post(multiparty, mediaController.save);

};