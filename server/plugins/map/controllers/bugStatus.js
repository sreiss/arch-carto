module.exports = function(bugStatusService) {

    return {
        getBugStatusList: function(req, res) {
            bugStatusService.getBugStatusList(req.query)
                .then(function(bugStatuses) {
                    res.json(bugStatuses);
                });
        },
        saveBugStatus: function(req, res) {
            bugStatusService.saveBugStatus(req.body)
                .then(function(bugStatus) {
                    res.json(bugStatus);
                });
        }
    };

};