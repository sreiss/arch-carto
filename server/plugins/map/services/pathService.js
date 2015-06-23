var Q = require('q'),
    ArchError = GLOBAL.ArchError;

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
                .populate('properties.medias')
                .populate('properties.coating')
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

        save: function(rawPath, options) {
            var self = this;
            var deferred = Q.defer();

            self.get(rawPath._id)
                .catch(function(err) {
                    if (err.message === 'PATH_NOT_FOUND') {
                        return Q.resolve(new Path({
                            properties: {
                                coating: rawPath.properties.coating || null,
                                junctions: rawPath.properties.junctions,
                                medias: rawPath.properties.medias || []
                            },
                            geometry: {
                                coordinates: rawPath.geometry.coordinates
                            }
                        }));
                    } else {
                        deferred.reject(err);
                    }
                 })
                .then(function(path) {
                    if (options && options.noAudit) {
                        path._noAudit = true;
                    } else {
                        path._user = rawPath._user;
                    }
                    path.save(function (err, savedPath) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(savedPath);
                        }
                    });
                });

            return deferred.promise;
        },

        savePaths: function(paths, options) {
            var self = this;
            var paths;
            var promises = [];

            options = options || {};
            options.returnIds = options.returnIds || true;

            for(var i = 0; i < paths.length; i += 1) {
                if (paths[i]._id) {
                    if (options.returnIds) {
                        promises.push(Q.resolve(paths[i]._id));
                    } else {
                        promises.push(Q.resolve(paths[i]));
                    }
                } else {
                    promises.push(self.save(paths[i])
                            .then(function(savedPath) {
                                if (options.returnIds) {
                                    return Q.resolve(savedPath._id.toHexString());
                                } else {
                                    return Q.resolve(savedPath);
                                }
                            })
                    );
                }
            }
            return Q.all(promises);
        }
    };

};