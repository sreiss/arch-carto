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
                poiService.getAllPois()
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
        savePoi: function(req, res) {
            poiService.save(req.body)
                .then(function(poi) {
                    res.json({
                        message: 'POI_SAVED',
                        value: poi
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
        },
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
    };

};

