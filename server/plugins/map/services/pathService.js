var Q = require('q');
var ArchError = GLOBAL.ArchError;

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
        get: function(id) {
            var deferred = Q.defer();
            Path.findById(id)
                .populate({
                    path: 'properties.auditEvents',
                    limit: 1
                })
                .populate('properties.auditEvents.userId')
                .exec(function(err, path) {
                    if (err) {
                        deferred.reject(err);
                    } else if (!path) {
                        deferred.reject(new ArchError('PATH_NOT_FOUND', 404));
                    } else {
                        deferred.resolve(path);
                    }
                });
            return deferred.promise;
        },
        save: function(rawPath) {
            var deferred = Q.defer();
            if (rawPath._id) {
                try {
                    var id = rawPath._id;
                    delete rawPath._id;
                    delete rawPath.properties.auditEvents;
                    Path.findByIdAndUpdate(id, rawPath, function(err, updatedPath) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(updatedPath);
                        }
                    });
                } catch(err) {
                    deferred.reject(err);
                }
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