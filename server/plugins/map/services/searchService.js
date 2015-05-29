var Q = require('q');

module.exports = function (Course) {
    return {
        makeResearch: function (filter){
            var deferred = Q.defer();
            var key, count = 0;
            // know how many properties are here
            for(key in filter.properties) {
                if(filter.properties.hasOwnProperty(key)) {
                    count++;
                }
            }

            var referred = "{";
            if(filter.properties.commentary)
            {
                var name = "'properties.commentary': '"+filter.properties.commentary+"'";
                referred = referred.concat(name);
                // if another property then add a comma
                if(count > 1)
                {
                    referred = referred.concat(',');
                }
            }

            if(filter.properties.difficulty)
            {
                var difficulty = "'properties.difficulty': '" + filter.properties.difficulty+"'";
                referred = referred.concat(difficulty);
            }
            referred = referred.concat('}');

            //var requete = referred.replace(/["]+/g, '');
            var txt = eval ("(" + referred + ")");
            console.log(txt);
            Course.find(txt, function(err, trace){
                if (err) {
                    console.log('error');
                    deferred.reject(err);
                } else {
                    //console.log('success'+trace);
                    deferred.resolve(trace);
                }

            });

            return deferred.promise;
        }
    };
};
