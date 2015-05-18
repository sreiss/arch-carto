var Q = require('q');

module.exports = function(Path) {

    return {
        getList: function(criteria) {
            var deferred = Q.defer();
            Path.find(criteria || {})
                .populate({
                    path: 'properties.auditEvents',
                    limit: 1
                })
                .exec(function(err, paths) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(paths);
                    }
                });
            return deferred.promise;
        },
        save: function(rawPath) {
            var deferred = Q.defer();
            if (rawPath._id) {

            } else {
                try {
                    var path = new Path({
                        properties: {
                            coating: rawPath.properties.coating || '',
                            altitudes: rawPath.properties.altitudes || []
                        },
                        geometry: {
                            coordinates: rawPath.geometry.coordinates
                        }
                    });
                    path.save(function(err, savedPath) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(savedPath);
                        }
                    })
                } catch(err) {
                    deferred.reject(err);
                }
            }
            return deferred.promise;
        }
    };

};