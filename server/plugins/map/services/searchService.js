var Q = require('q');

module.exports = function (Course) {
    return {
        makeResearch: function (filter){
            var deferred = Q.defer();
            var key, count = 0;
            var i = 1;
            //console.log(filter);

            // know how many properties are here
            for(key in filter.properties) {
                if(filter.properties.hasOwnProperty(key)) {
                    count++;
                }
            }
            console.log(count);
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


            if(filter.properties.maxLength && filter.properties.minLength)
            {
                var and = "$and :["
                var minLength = "{'properties.length': {$gte :"+filter.properties.minLength+"}},";
                var maxLength = "{'properties.length': {$lte : "+filter.properties.maxLength+"}}]";
                referred = referred.concat(and);
                referred = referred.concat(minLength);
                referred = referred.concat(maxLength);
                i ++;
                if(i != count)
                {
                    referred = referred.concat(',');
                    i ++;
                }
            }
            referred = referred.concat('}');
            console.log(referred);
            //var requete = referred.replace(/["]+/g, '');
            var txt = eval ("(" + referred + ")");
            console.log('test');

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
