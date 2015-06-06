module.exports = function(junctionService, crudControllerFactory) {

    return crudControllerFactory.init('JUNCTION', junctionService);
    /*
    return {
        getList: function(req, res, next) {
            junctionService.getList()
                .then(function(junctions) {
                    res.send({
                        message: 'JUNCTION_LIST',
                        value: junctions
                    })
                })
                .catch(function(err) {
                    next(err);
                });
        },
        save: function(req, res, next) {
            junctionService.save(req.body)
                .then(function(saveJunction) {
                    res.send({
                        message: 'JUNCTION_SAVED',
                        value: saveJunction
                    })
                })
                .catch(function(err) {
                    next(err);
                });
        }
    }
    */

};