var Q = require('q');

module.exports = function (Course) {
    return {
        makeResearch: function (filter){
            var deferred = Q.defer();
            var key, count = 0;
            var i = 1;
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
                if(i != count)
                {
                    referred = referred.concat(',');
                    i ++;
                }
            }

            if(filter.properties.difficulty)
            {
                var difficulty = "'properties.difficulty': '" + filter.properties.difficulty+"'";
                referred = referred.concat(difficulty);
                if(i != count)
                {
                    referred = referred.concat(',');
                    i ++;
                }
            }

            if(filter.properties.minLength)
            {
                var km = filter.properties.minLength * 1000;
                var minLength = "'properties.length': {$gte :"+km+"}"
                if(i != count)
                {
                    referred = referred.concat(',');
                    i ++;
                }
            }

            if(filter.properties.maxLength)
            {
                var km = filter.properties.maxLength * 1000;
                var minLength = "'properties.length': {$lte :"+km+"}"
                if(i != count)
                {
                    referred = referred.concat(',');
                    i ++;
                }
            }
            referred = referred.concat('}');

            //var requete = referred.replace(/["]+/g, '');
            var txt = eval ("(" + referred + ")");
            console.log(filter);
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
