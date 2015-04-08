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
            var bug = req.body;
            bugService.saveBug(bug)
                .then(function(savedBug) {
                    res.json({message: 'Bug saved!'});
                })
                .catch(function(err) {
                    res.send(err);
                });
        }
    };

};
