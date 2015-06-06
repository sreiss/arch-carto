var Q = require('q');

module.exports = function(Junction, pathService) {

    return {
        getList: function() {
            var deferred = Q.defer();

            Junction.find()
                .populate('properties.paths')
                .exec(function(err, junctions) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(junctions);
                    }
                });

            return deferred.promise;
        },
        save: function(rawJunction) {
            var deferred = Q.defer();

            if (rawJunction._id) {
                var id = rawJunction._id;
                delete rawJunction._id;
                Junction.findByIdAndUpdate(id, rawJunction, function(err, updatedJunction) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(updatedJunction);
                    }
                });
            } else {
                var junction = new Junction({
                    properties: {
                        paths: rawJunction.properties.paths || []
                    },
                    geometry: {
                        coordinates: rawJunction.geometry.coordinates
                    }
                });

                var paths;
                var promises = [];
                for(var i = 0; i < (paths = rawJunction.properties.paths).length; i += 1) {
                    if (paths[i]._id) {
                        promises.push($q.when(junction.properties.paths.push(paths[i]._id)));
                    } else {
                        promises.push(pathService.save(paths[i])
                            .then(function(savedPath) {
                                junction.properties.paths.push(savedPath._id);
                                return true;
                            })
                            .catch(function(err) {
                                return err;
                            }));
                    }
                }
                Q.all(promises)
                    .then(function() {
                        junction.save(function(err, savedJunction) {
                            if (err) {
                                deferred.reject(err);
                            } else {
                                deferred.resolve(savedJunction);
                            }
                        });
                    })
                    .catch(function(err) {
                        deferred.reject(err);
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
            }

            return deferred.promise;
        }
    }

};