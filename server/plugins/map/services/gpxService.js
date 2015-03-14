var Q = require('q');
var fs = require ('fs');
var path = require('path');

module.exports = function (Trace) {

    var storageCreated = false;
    var createStorage = function() {
        fileStorageService.addStorage('map', 'gpx');
        storageCreated = true;
    };

    return {
        saveGpx: function(gpxFile) {
            createStorage();
        },
        getTrace: function(options) {
            var deferred = Q.defer();
            //options = options || {};
            //Trace.find(function(err, trace) {
            //    if (err) {
            //        deferred.reject(err);
            //    } else {
            //        deferred.resolve(trace);
            //    }
            //});
            console.log("Bonjour");

            var filePath = path.join(__dirname, '../../../test4.gpx');
            fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data){
                if (!err){
                    console.log("Bonjour2");


                            console.log('received data: ' + data);
                            //response.writeHead(200, {'Content-Type': 'text/html'});
                            //response.write(data);
                            //response.end();
                            deferred.resolve(data);




                }else{
                    console.log(err);
                }
            });
            return deferred.promise;
        }
    };

};