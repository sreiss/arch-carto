module.exports = function(junctionController, junctionRouter) {

    junctionRouter.route('/')
        .get(junctionController.getList)
        .post(junctionController.save);

};