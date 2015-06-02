module.exports = function(bugService, crudControllerFactory) {

    return crudControllerFactory.init('BUG', bugService);
    /*
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
                        message: 'BUG_LIST',
                        value: bugList
                    });
                })
                .catch(function(err) {
                    next(err);
                });
        },
        saveBug: function(req, res, next) {
            var isUpdate = !!req.body._id;
            bugService.save(req.body)
                .then(function(savedBug) {
                    if (!isUpdate) {
                        req.archIo.namespace.emit('new', {
                            message: 'NEW_BUG',
                            value: savedBug
                        });
                        res.json({
                            message: 'BUG_REPORTED'
                        });
                    } else {
                        req.archIo.namespace.emit('update', {
                            message: 'BUG_UPDATE',
                            value: savedBug
                        });
                        res.json({
                            message: 'BUG_UPDATED'
                        })
                    }
                })
                .catch(function(err) {
                    next(err);
                });
        }
        /*
        io: {
            save: function(socket, bugNamespace) {
                return function(bug) {
                    bugService.save(bug)
                        .then(function(savedBug) {
                            var lastEvent = savedBug.properties.auditEvents[savedBug.properties.auditEvents.length - 1];
                            socket.emit('save', {
                                message: 'BUG_' + lastEvent.type
                            });
                            bugNamespace.emit('new', {
                                message: 'NEW_BUG',
                                value: savedBug
                            });
                        })
                        .catch(function(err) {
                            socket.emit('archError', {
                                message: err.message
                            });
                        });
                }
            }
        }
    };*/

};
