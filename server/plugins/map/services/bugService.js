var Q = require('q');
var ArchError = GLOBAL.ArchError;

module.exports = function(Bug, bugStatusService, formatterService, auditEventService) {

    return {
        get: function(id) {
            var deferred = Q.defer();
            Bug.findById(id)
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
        getList: function(criteria) {
            var deferred = Q.defer();
            criteria = criteria || {};
            Bug.find(criteria)
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
        save: function(rawBug) {
            var deferred = Q.defer();
            if (rawBug._id) {
                auditEventService.canUpdate(rawBug)
                    .then(function() {
                        var id = rawBug._id;
                        delete rawBug._id;
                        Bug.findOneAndUpdate({_id: id}, {$set: rawBug}, function (err, bug) {
                            if (err) {
                                deferred.reject(err);
                            } else {
                                deferred.resolve(bug);
                            }
                        });
                    })
                    .catch(function(err) {
                       deferred.reject(err);
                    });
            } else {
                /*bugStatusService.findOneBugStatus({name: 'REPORTED'})
                    .catch(function(err) {
                        return bugStatusService.saveBugStatus({
                            name: 'REPORTED',
                            description: 'A_NEWLY_REPORTED_BUG'
                        });
                    })
                    .then(function(bugStatus) {*/
                        var bug = new Bug({
                            properties: {
                                // TODO: Get the user ID
                                //userId: rawBug.properties.userId,
                                // TODO: Get the point altitude
                                altitude: rawBug.properties.altitude,
                                description: rawBug.properties.description,
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
                    /*});*/
            }
            return deferred.promise;
        },
        delete: function(id) {
            var deferred = Q.defer();
            Bug.findOne({_id: id}, function(err, bug) {
                if (err) {
                    deferred.reject(err);
                } else if (bug !== null) {
                    bug.delete()
                        .then(function(deletedBug) {
                            deferred.resolve(deletedBug);
                        })
                        .catch(function(err) {
                            deferred.reject(err);
                        })
                } else {
                    deferred.reject(new ArchError('THE_SPECIEFIED_BUG_DOES_NOT_EXISTS', 404));
                }
            });
            return deferred.promise;
        }
    };

};