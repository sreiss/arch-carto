var Q = require('q');

module.exports = function(Bug) {

    return {
        getBugList: function(criteria) {
            var deferred = Q.defer();
            criteria = criteria || {};
            Bug.find(criteria)
                .populate('properties.status')
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
                var bug = new Bug({
                    properties: {
                        // TODO: Get the user ID
                        userId: rawBug.properties.userId,
                        // TODO: Get the point altitude
                        altitude: rawBug.properties.altitude,
                        description: rawBug.properties.description,
                        status: rawBug.properties.status
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
            }
            return deferred.promise;
        }
    };

};