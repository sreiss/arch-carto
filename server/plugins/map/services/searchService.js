var Q = require('q');

module.exports = function (Course) {
    return {
        makeResearch: function (filter){
            var deferred = Q.defer();
            var key, count = 0;
            var i = 1;
            console.log(filter);

            // know how many properties are here
            for(key in filter.properties) {
                if(filter.properties.hasOwnProperty(key)) {
                    count++;
                }
            }
            var referred = "{";

            var latNW = filter.properties.NW.lat;
            var longNW = filter.properties.NW.lng;
            var latNE = filter.properties.NE.lat;
            var longNE = filter.properties.NE.lng;
            var latSW = filter.properties.SW.lat;
            var longSW = filter.properties.SW.lng;
            var latSE = filter.properties.SE.lat;
            var longSE = filter.properties.SE.lng;

            var mapBounds =  " 'geometry' : { $geoWithin : { $geometry: { type: 'Polygon', coordinates: [[ ["+longNW+","+latNW+"], ["+longNE+","+latNE+"], ["+longSE+","+latSE+"], ["+longSW+","+latSW+"],["+longNW+","+latNW+"] ]] }}}";
            referred = referred.concat(mapBounds);

            // minus 4 for the map bound because they will always be there

            count -= 4;
            if(count != 0)
            {
                referred = referred.concat(',');
            }

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
            //fonction qui a tendance a coincer
            var txt = eval ("(" + referred + ")");
            //
            console.log(txt);


            //Course.schema.index({ 'geometry': '2dsphere' });
            console.log('test');
           Course.find(txt,function(err, traces) {
                if (err) {
                    deferred.reject(err);
                } else {
                    //console.log(traces[0].geometry.coordinates[0]);
                    //var test = traces[0].geometry.coordinates[0];
                    deferred.resolve(traces);

                }});



            //only geo
            //Course.find( { 'geometry' :
            //{ $geoWithin
            //    : { $geometry:
            //{ type: 'Polygon', coordinates: [[ [longNW,latNW], [longNE,latNE], [longSE,latSE], [longSW,latSW],[longNW,latNW] ]] } } }}, function(err, trace){
            //    if (err) {
            //        console.log('error: '+err);
            //        deferred.reject(err);
            //    } else {
            //        console.log('success');
            //        console.log(trace);
            //
            //        deferred.resolve(trace);
            //    }
            //
            //});

            return deferred.promise;
        }
    };
};
