var Q = require('q');

module.exports = function(Poi, poiTypeService) {

    return {
        getPoi: function(id, options) {
            var deferred = Q.defer();

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

            Poi.findById(id)
                .populate(populate.join(' '))
                .exec(function (err, poi) {
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
        getAllPois: function() {
            var deferred = Q.defer();
            Poi.find()
                .populate('properties.type')
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
        savePoi: function(rawPoi) {
            var deferred = Q.defer();
            if (rawPoi._id) {
                var id = rawPoi._id;
                delete rawPoi._id;
                Poi.findByIdAndUpdate(id, rawPoi, function(err, poi) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(poi);
                    }
                });
            } else {
                var poi = new Poi({
                    properties: {
                        // TODO: Get the user ID
                        userId: rawPoi.properties.userId,
                        // TODO: Get the point altitude
                        altitude: rawPoi.properties.altitude,
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
