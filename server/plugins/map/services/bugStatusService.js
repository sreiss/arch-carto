var Q = require('q');

module.exports = function(BugStatus) {

    return {
        findOneBugStatus: function(criteria) {
            var deferred = Q.defer();
            if (!criteria) {
                deferred.reject(new Error('A criteria is required to execute this method.'));
            }
            BugStatus.findOne(criteria, function(err, bugStatus) {
                if (err) {
                    deferred.reject(err);
                } else if (!bugStatus) {
                    deferred.reject(new Error('No bug status found matching that criteria.'));
                } else {
                    deferred.resolve(bugStatus);
                }
            });
            return deferred.promise;
        },
        findBugStatuses: function(criteria) {
            var deferred = Q.defer();
            criteria = criteria || {};
            BugStatus.find(criteria, function(err, bugStatuses) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(bugStatuses);
                }
            });
            return deferred.promise;
        },
        saveBugStatus: function(rawBugStatus) {
            var deferred = Q.defer();
            if (rawBugStatus._id) {
                var id = rawBugStatus._id;
                delete rawBugStatus._id;
                BugStatus.findByIdAndUpdate(id, { $set: rawBugStatus }, function(err, savedBugStatus) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(savedBugStatus);
                    }
                });
            } else {
                var bugStatus = new BugStatus({
                    name: rawBugStatus.name,
                    description: rawBugStatus.description
                });

                bugStatus.save(function(err, savedBugStatus) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(savedBugStatus);
                    }
                });
            }
            return deferred.promise;
        }
    }

};
