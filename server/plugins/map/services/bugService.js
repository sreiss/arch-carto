var Q = require('q');

module.exports = function(Bug) {

    return {
        getBugList: function(options) {
            var deferred = Q.defer();
            options = options || {};
            Bug.find(function(err, bugs) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(bugs);
                }
            });
            return deferred.promise;
        },
        saveBug: function(rawBug, options) {
            var deferred = Q.defer();
            options = options || {};

            var bug = new Bug();
            bug.description = rawBug.description;
            bug.coordinates = rawBug.coordinates;
            bug.save(function(err) {
               if (err) {
                   deferred.reject(err);
               } else {
                   deferred.resolve(bug);
               }
            });

            return deferred.promise;
        }
    };

};