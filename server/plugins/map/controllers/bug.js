module.exports = function(bugService) {

    return {
        getBug: function(req, res, next) {
            bugService.get(req.params.id)
                .then(function(bug) {
                    res.json({
                        message: 'BUG_RETRIEVED',
                        value: bug
                    });
                })
                .catch(function(err) {
                    next(err);
                });
        },
        getBugList: function(req, res, next) {
            bugService.getBugList(req.query)
                .then(function(bugList) {
                    res.json({
                        value: bugList
                    });
                })
                .catch(function(err) {
                    next(err);
                });
        },
        saveBug: function(req, res, next) {
            bugService.save(req.body)
                .then(function(savedBug) {
                    res.json({
                        message: 'BUG_REPORTED',
                        value: savedBug
                    });
                })
                .catch(function(err) {
                    next(err);
                });
        },
        io: {
            save: function(socket, bugNamespace) {
                return function(bug) {
                    bugService.save(bug)
                        .then(function(savedBug) {
                            socket.emit('save', {
                                message: 'BUG_REPORTED'
                            });
                            bugNamespace.emit('new', {
                                message: 'NEW_BUG',
                                value: savedBug
                            });
                        })
                        .catch(function(err) {
                            bugNamespace.emit('error', err);
                        });
                }
            }
        }
    };

};
