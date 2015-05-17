var Q = require('q');
var ArchError = GLOBAL.ArchError;

module.exports = function(Bug, bugStatusService) {

    return {
        get: function(id) {
            var deferred = Q.defer();
            Bug.findById(id)
                .populate('properties.status')
                .populate({
                    path: 'properties.auditEvents',
                    limit: 1
                })
                .exec(function(err, bug) {
                   if (err) {
                       deferred.reject(err);
                   } else if (!bug) {
                       deferred.reject(ArchError('BUG_NOT_FOUND'));
                   } else {
                       deferred.resolve(bug);
                   }
                });
            return deferred.promise;
        },
        getBugList: function(criteria) {
            var deferred = Q.defer();
            criteria = criteria || {};
            Bug.find(criteria)
                .populate('properties.status')
                .populate({
                    path: 'properties.auditEvents',
                    limit: 1
                })
                .exec(function(err, bugs) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(bugs);
                    }
                });
            return deferred.promise;
        },
        saveBug: function(rawBug) {
            var deferred = Q.defer();
            if (rawBug._id) {
                var id = rawBug._id;
                delete rawBug._id;
                Bug.findByIdAndUpdate(id, rawBug, function(err, bug) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(bug);
                    }
                });
            } else {
                bugStatusService.findOneBugStatus({name: 'REPORTED'})
                    .catch(function(err) {
                        return bugStatusService.saveBugStatus({
                            name: 'REPORTED',
                            description: 'A_NEWLY_REPORTED_BUG'
                        });
                    })
                    .then(function(bugStatus) {
                        var bug = new Bug({
                            properties: {
                                // TODO: Get the user ID
                                //userId: rawBug.properties.userId,
                                // TODO: Get the point altitude
                                altitude: rawBug.properties.altitude,
                                description: rawBug.properties.description,
                                status: bugStatus._id,
                                entity: 'Bug'
                            },
                            geometry: {
                                coordinates: rawBug.geometry.coordinates
                            }
                        });
                        bug.save(function (err) {
                            if (err) {
                                deferred.reject(err);
                            } else {
                                deferred.resolve(bug);
                            }
                        });
                    });
            }
            return deferred.promise;
        }
    };

};