var Q = require('q');

module.exports = function (Course) {
    return {
        makeResearch: function (filter){
            var deferred = Q.defer();
            if(filter.name)
            {
                var name = filter.name;

                Course.find({ 'properties.commentary' : name}, function(err, trace){
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(trace);
                    }

                });
            }
            return deferred.promise;
        }
    };
};
