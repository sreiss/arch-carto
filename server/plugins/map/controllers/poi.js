var camelCase = require('camel-case');

module.exports = function (poiService) {

    return {
        getPoi: function(req, res, next) {
            if (req.params.id) {
                poiService.getPoi(req.params.id, {
                        noAudit: !!req.query['no-audit'],
                        noType: !!req.query['no-type'],
                        noMedias: !!req.query['no-medias']
                    })
                    .then(function(poi) {
                        res.json(poi);
                    }, function(err) {
                        next(err);
                    });
            } else {
                var criterias = {};
                for (var key in req.query) {
                    criterias[camelCase(key)] = req.query[key];
                }
                poiService.getAllPois(criterias)
                    .then(function(pois) {
                        res.json({
                            message: 'POI_LIST',
                            value: pois
                        });
                    }, function(err) {
                        next(err);
                    });
            }
        },
        savePoi: function(req, res, next) {
            poiService.save(req.body)
                .then(function(savedPoi) {
                    req.archIo.namespace.emit('new', {
                        message: 'NEW_POI',
                        value: savedPoi
                    });
                    res.json({
                        message: 'POI_SAVED'
                    });
                })
                .catch(function(err) {
                    next(err);
                });
        },
        deletePoi: function(req, res) {
            poiService.deletePoi(req.params.id)
                .then(function(poi) {
                    res.json('Poi ' + poi.name + ' deleted!');
                }, function(err) {
                    next(err);
                });
        }/*,
        io: {
            save: function(socket, namespace) {
                return function(poi) {
                    poiService.save(poi)
                        .then(function(savedPoi) {
                            socket.emit('save', {
                                message: 'POI_SAVED'
                            });
                            namespace.emit('new', {
                                message: 'NEW_POI',
                                value: savedPoi
                            });
                        })
                        .catch(function(err) {
                            socket.emit('archError', {
                                err: err.message
                            });
                        });
                }
            }
        }
        */
    };

};

