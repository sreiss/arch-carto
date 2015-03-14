module.exports = function(bugController, bugRouter) {

    bugRouter.route('/')
        .get(bugController.getBugList)
        .post(bugController.saveBug);

};