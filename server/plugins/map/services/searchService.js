var Q = require('q');

module.exports = function (Trace) {
    return {
        makeResearch: function (filter){
            var deferred = Q.defer();
            if(filter.name)
            {
                var name = filter.name;
                Trace.find({ 'features.properties.name' : name}).lean().exec(options, function(err, trace){
                    if (err) {
                        console.log('coucou');
                        deferred.reject(err);
                    } else {
                        console.log(trace);
                        console.log('coucou');
                        deferred.resolve(trace);
                    }

                return deferred.promise;

                })
            }

        }
    };
};
