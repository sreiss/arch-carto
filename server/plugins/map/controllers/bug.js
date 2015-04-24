module.exports = function(bugService) {

    return {
        getBugList: function(req, res) {
            bugService.getBugList(req.query)
                .then(function(bugList) {
                    res.json(bugList);
                })
                .catch(function(err) {
                    res.send(err);
                });
        },
        saveBug: function(req, res) {
            bugService.saveBug(req.body)
                .then(function(savedBug) {
                    res.json(savedBug);
                })
                .catch(function(err) {
                    res.send(err);
                });
        }
    };

};
