module.exports = function(pathService) {

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
        }
    }

};