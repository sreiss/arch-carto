module.exports = function(pathService, crudControllerFactory) {

    return crudControllerFactory.extend('PATH', pathService, {
        save: function (req, res, next) {
            var isUpdate = !!req.body._id;
            pathService.save(req.body)
                .then(function (savedEntity) {
                    if (!isUpdate) {
                        req.archIo.namespace.emit('new', {
                            message: 'NEW_PATH',
                            value: savedEntity
                        });
                        res.json({
                            message: 'PATH_ADDED',
                            value: savedEntity
                        });
                    } else {
                        req.archIo.namespace.emit('update', {
                            message: 'PATH_UPDATE',
                            value: savedEntity
                        });
                        res.json({
                            message: 'PATH_UPDATED',
                            value: savedEntity
                        })
                    }
                })
                .catch(function (err) {
                    next(err);
                });
        }
    });
    /*
    return {
        getList: function(req, res, next) {
            pathService.getList()
                .then(function(paths) {
                    res.json({
                        message: 'PATH_LIST',
                        value: paths
                    });
                })
                .catch(function(err) {
                    next(err);
                });
        },
        save: function(req, res, next) {
            pathService.save(req.body)
                .then(function(path) {
                    res.json({
                        message: 'PATH_SAVED',
                        value: path
                    });
                })
                .catch(function(err) {
                   next(err);
                });
        },
        get: function(req, res, next) {
            pathService.get(req.params.id)
                .then(function(path) {
                    res.json({
                        message: 'PATH_RETRIEVED',
                        value: path
                    });
                })
                .catch(function(err) {
                   next(err);
                });
        }
    }
    */

};