var Q = require('q'),
    _ = require('underscore'),
    ArchError = GLOBAL.ArchError;

module.exports = (function(Junction, pathService) {

    //var _doGeoGetList = function(criterias) {
    //    var deferred = Q.defer();
    //    criterias.radius = parseInt(criterias.radius, 10) || 3000;
    //    criterias.lat = parseFloat(criterias.lat);
    //    criterias.lng = parseFloat(criterias.lng);
    //    if (!isNaN(criterias.lat) && !isNaN(criterias.lng) && !isNaN(criterias.radius)) {
    //        var center = {
    //            type: 'Point',
    //            coordinates: [criterias.lng, criterias.lat]
    //        };
    //        var options = {
    //            maxDistance: criterias.radius,
    //            spherical: true
    //        };
    //        Junction.geoNear(center, options)
    //            .then(function(err, junctions) {
    //                if (err) {
    //                    deferred.reject(err);
    //                } else {
    //                    deferred.resolve(junctions);
    //                }
    //            });
    //    } else {
    //        deferred.reject(new ArchError('INVALID_COORDINATES'));
    //    }
    //    return deferred.promise;
    //};

    //var _doGetList = function(criterias) {
    //    var deferred = Q.defer();
    //    criterias = criterias || {};
    //
    //    Junction.find(criterias)
    //        .exec(function(err, junctions) {
    //            if (err) {
    //                deferred.reject(err);
    //            } else {
    //                var pathIds = [];
    //                for (var i = 0; i < junctions.length; i += 1) {
    //                    var junction = junctions[i];
    //                    var paths = junction.properties.paths;
    //                    for (var j = 0; j < paths.length; j += 1) {
    //                        var pathId = paths[j];
    //                        if (pathId) {
    //                            pathId = pathId.toHexString();
    //                            if (!_.contains(pathIds, pathId)) {
    //                                pathIds.push(pathId);
    //                            }
    //                        }
    //                    }
    //                }
    //                pathService.getList({
    //                    _id: {
    //                        $in: pathIds
    //                    }
    //                })
    //                    .then(function(paths) {
    //                        deferred.resolve({
    //                            paths: paths,
    //                            junctions: junctions
    //                        });
    //                    });
    //            }
    //        });
    //
    //    return deferred.promise;
    //};
    return {
        get: function(id) {
            var deferred = Q.defer();

            if (!id) {
                deferred.reject(new ArchError('PLEASE_PROVIDE_AN_ID'));
            } else {
                Junction.findById(id)
                    .populate('properties.paths')
                    .exec(function (err, junction) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(junction);
                        }
                    });
            }

            return deferred.promise;
        },

        getList: function(criterias) {
            //if (criterias.lat && criterias.lng) {
            //    return _doGeoGetList(criterias);
            //} else {
            //    return _doGetList(criterias);
            //}
            var deferred = Q.defer();

            var query = Junction.find();

            if (criterias.lat && criterias.lng) {
                criterias.radius = parseInt(criterias.radius, 10) || 3000;
                criterias.lat = parseFloat(criterias.lat);
                criterias.lng = parseFloat(criterias.lng);
                if (!isNaN(criterias.lat) && !isNaN(criterias.lng) && !isNaN(criterias.radius)) {
                    query.where('geometry')
                        .near({
                            center: {
                                type: 'Point',
                                coordinates: [criterias.lng, criterias.lat]
                            },
                            maxDistance: criterias.radius,
                            spherical: true
                        });
                }
            }

            query.exec(function(err, junctions) {
                if (err) {
                    deferred.reject(err);
                } else {
                    var pathIds = [];
                    for (var i = 0; i < junctions.length; i += 1) {
                        var junction = junctions[i];
                        var paths = junction.properties.paths;
                        for (var j = 0; j < paths.length; j += 1) {
                            var pathId = paths[j];
                            if (pathId) {
                                pathId = pathId.toHexString();
                                if (!_.contains(pathIds, pathId)) {
                                    pathIds.push(pathId);
                                }
                            }
                        }
                    }
                    pathService.getList({
                            _id: {
                                $in: pathIds
                            }
                        })
                        .then(function(paths) {
                            deferred.resolve({
                                paths: paths,
                                junctions: junctions
                            });
                        });
                }
            });

            return deferred.promise;
        },

        _saveJunction: function(rawJunction) {
            var self = this;
            var deferred = Q.defer();

            this.get(rawJunction._id)
                .catch(function(err) {
                    if (err.message == 'PLEASE_PROVIDE_AN_ID') {
                        return Q.resolve(new Junction({
                            properties: {
                                paths: rawJunction.properties.paths || []
                            },
                            geometry: {
                                coordinates: rawJunction.geometry.coordinates
                            }
                        }));
                    } else {
                        throw err;
                    }
                })
                .then(function(junction) {
                    junction.save(function(err, savedJunction) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            Junction.populate(savedJunction, { path: 'properties.paths' }, function(err, populatedJunction) {
                                deferred.resolve(populatedJunction);
                            });
                        }
                    });
                });

            return deferred.promise;
        },

        save: function(rawJunction) {
            var self = this;

            //if (rawJunction._id) {
            //    var id = rawJunction._id;
            //    delete rawJunction._id;
            //    Junction.findByIdAndUpdate(id, rawJunction, function(err, updatedJunction) {
            //        if (err) {
            //            deferred.reject(err);
            //        } else {
            //            deferred.resolve(updatedJunction);
            //        }
            //    });
            //} else {
            for (var i = 0; i < rawJunction.properties.paths.length; i += 1) {
                rawJunction.properties.paths[i]._user = rawJunction._user;
            }

            return pathService.savePaths(rawJunction.properties.paths)
                .then(function(pathIds) {
                    rawJunction.properties.paths = pathIds;
                    return self._saveJunction(rawJunction);
                })
                .then(function(junction) {
                    var promises = [];
                    var paths = [];
                    for (var i = 0; i < (paths = junction.properties.paths).length; i += 1) {
                        var path = paths[i];
                        var foundJunction = _.find(path.junctions, function(j) {
                            if (j && junction) {
                                return j._id === junction._id;
                            } else {
                                return false;
                            }
                        });
                        if (!foundJunction) {
                            path.properties.junctions.push(
                                junction
                            );
                            promises.push(pathService.save(path));
                        }
                    }
                    return Q.when(Q.all(promises)
                        .then(function(results) {
                            return Q.resolve(junction);
                        })
                        .catch(function(err) {
                            return Q.reject(err);
                        })
                    );
                })
                .then(function(results) {
                    return results;
                });

                /*
                junction.save(function(err, savedJunction) {
                   if (err) {
                       deferred.reject(err);
                   } else {
                       deferred.resolve(savedJunction);
                   }
                });
                */
            //}
        }
    }

});