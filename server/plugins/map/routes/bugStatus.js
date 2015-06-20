module.exports = function(bugStatusController, bugStatusRouter)
{
    bugStatusRouter.route('/')
        .get(bugStatusController.getBugStatusList)
        .post(bugStatusController.saveBugStatus);
};