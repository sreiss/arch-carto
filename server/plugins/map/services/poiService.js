var Q = require('q');

module.exports = function(Poi, poiTypeService, auditEventService) {

    return {
        getPoi: function(id, options) {
            var deferred = Q.defer();

            var query = Poi.findById(id);

            var populate = [];

            if (!options.noType) {
                populate.push('properties.type');
            }

            if (!options.noAudit) {
                populate.push({
                    path: 'properties.auditEvents',
                    limit: 1
                });
            }

            if (!options.noMedias) {
                populate.push('properties.medias');
            }

            for (var i = 0; i < populate.length; i += 1) {
                query.populate.apply(query, [populate[i]]);
            }

            query.exec(function (err, poi) {
                    if (err) {
                        deferred.reject(err);
                    }
                    if (poi == null) {
                        deferred.reject(new Error('Poi ' + id + ' not found'));
                    }
                    deferred.resolve(poi);
                });
            return deferred.promise;
        },
        getAllPois: function(criterias) {
            var deferred = Q.defer();
            var query = Poi.find();

            if (!!criterias && criterias['with-medias']) {
                query.populate('properties.medias');
            }

            query.populate('properties.type')
                .populate({
                    path: 'properties.auditEvents',
                    limit: 1
                })
                .exec(function (err, pois) {
                    if (err) {
                        deferred.reject(err);
                    }
                    deferred.resolve(pois);
                });
            return deferred.promise;
        },
        save: function(rawPoi) {
            var deferred = Q.defer();
            if (rawPoi._id) {
                auditEventService.canUpdate(rawPoi)
                    .then(function() {
                        var id = rawPoi._id;
                        delete rawPoi._id;
                        Poi.findByIdAndUpdate(id, rawPoi, function (err, poi) {
                            if (err) {
                                deferred.reject(err);
                            } else {
                                deferred.resolve(poi);
                            }
                        });
                    })
                    .catch(function(err) {
                        deferred.reject(err);
                    });
            } else {
                var poi = new Poi({
                    properties: {
                        // TODO: Get the user ID
                        userId: rawPoi.properties.userId,
                        // TODO: Get the point altitude
                        medias: rawPoi.properties.medias,
                        description: rawPoi.properties.description,
                        type: rawPoi.properties.type,
                        name: rawPoi.properties.name,
                        entity: 'Poi'
                    },
                    geometry: {
                        coordinates: rawPoi.geometry.coordinates
                    }
                });
                poi.save(function (err) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(poi);
                    }
                });
            }
            return deferred.promise;
        },
        deletePoi: function(id) {
            var deferred = Q.defer();
            Poi.findByIdAndRemove(id, function(err, poi) {
                if (err) {
                    deferred.reject(err);
                }

                if (poi == null) {
                    deferred.reject(new Error('Poi ' + id + ' not found'));
                }
                deferred.resolve(poi);
            });
            return deferred.promise;
        }
    };

}
