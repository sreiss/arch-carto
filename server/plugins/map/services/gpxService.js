var Q = require('q');
var fs = require ('fs');
var path = require('path');
var jsdom = require('jsdom').jsdom;
var togeojson = require('togeojson');

module.exports = function (Trace) {

    var storageCreated = false;
    var createStorage = function() {
        fileStorageService.addStorage('map', 'gpx');
        storageCreated = true;
    };

    return {
        saveGpx: function(gpxFile, options) {
            var deferred = Q.defer();
            //createStorage();
            console.log('Je save la');
            var filePath = path.join(__dirname, '../../../uploads/');
            console.log(filePath);
            fs.readdir(filePath, function(err, files){
                //console.log(files.length);
                for(var i = 0; i<files.length; i++)
                {
                    fs.readFile(filePath+files[i],{encoding: 'utf-8'}, function(err, data){
                        if (!err){
                            //console.log('received data: ' + data);

                            options = options || {};

                            // TODO: Validation, to check the id exists!
                            //if (gpxFile._id) {
                            //    var id = gpxFile._id;
                            //    delete gpxFile._id;
                            //    Trace.findByIdAndUpdate(id, gpxFile, function(err, trace) {
                            //        if (err) {
                            //            deferred.reject(err);
                            //        } else {
                            //            deferred.resolve(trace);
                            //        }
                            //    });
                            //} else {
                                var trace = new Trace();
                                var gpx = jsdom(data);
                                var converted = togeojson.gpx(gpx);
                                //console.log('je converti des fichiers');
                                //console.log(JSON.stringify(converted, null, 2));
                                //console.log(converted.features[0].properties.name);
                                trace.type = converted.type;
                                trace.features[0] = converted.features[0];
                            //console.log(JSON.stringify(trace, null, 2));
                            trace.save(function(err) {
                                    if (err) {
                                        console.log('Ca marche pas');
                                        deferred.reject(err);
                                    }
                                console.log('Save in db');
                                    deferred.resolve(trace);
                                })

                        }else{
                            console.log(err);

                        }
                        return deferred.promise;
                    })

                }

            });
        },
        getTrace: function(options) {
            //new version
            var deferred = Q.defer();
            options = options || {};
            Trace.find().lean().exec(options, function(err, traces) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(traces);
                    //console.log(traces);
                }
            });
            return deferred.promise;

        }
    };

};