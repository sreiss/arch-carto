var Q = require('q');
var fs = require ('fs');
var path = require('path');
var util = require('util');
//var jsdom = require('jsdom').jsdom;
var togeojson = require('togeojson');

module.exports = function (Path) {

    //return {};

    return {
        saveGpx: function(rawPath, options) {
            var deferred = Q.defer();
            console.log(rawPath);
            if (rawPath._id) {
                console.log("saveGpx");

                var id = rawPath._id;

                delete rawPath._id;
                console.log(JSON.stringify(rawPath));

                Path.findById(id).lean().exec(function(err, rawPath){
                    if (err) {
                        console.log("Error nouveau geojson");
                        deferred.reject(err);
                    } else {
                        var modifiedTrace = new Path();
                        console.log("Coming from");
                        console.log(JSON.stringify(rawPath));
                        Trace.findByIdAndRemove(id, function(err, rawPath){
                            if (err) {
                                console.log("Error nouveau geojson");
                                deferred.reject(err);
                            } else {
                                console.log('Delete in db');
                            }

                        })
                        modifiedTrace._id = id;
                        modifiedTrace.type = rawPath.type;
                        modifiedTrace.features[0] = rawPath.features[0];
                        modifiedTrace.save(function(err) {
                            if (err) {
                                console.log('Ca marche pas');
                                deferred.reject(err);
                            }
                            console.log('Save in db');
                            console.log(JSON.stringify(rawPath));
                            deferred.resolve(rawPath);
                        })
                    }
                });
            } else {
                try {
                    var path = new Path({
                        properties: {
                            coating: rawPath.features[0]. properties.coating || null,
                            //medias: rawPath.properties.medias || []
                            length: rawPath.features[0].properties.length,
                            dPlus: rawPath.features[0].properties.dPlus,
                            dMinus: rawPath.features[0].properties.dMinus
                        },
                        geometry: {
                            coordinates: rawPath.features[0].geometry.coordinates
                        }
                    });
                    path._noAudit = true;
                    path.save(function(err, savedPath) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(savedPath);
                        }
                    })
                } catch(err) {
                    deferred.reject(err);
                }

            }
            return deferred.promise;

        },
        getTrace: function(options) {
            //new version
            var deferred = Q.defer();
            options = options || {};
            Path.find().lean().exec(options, function(err, traces) {
                if (err) {
                    deferred.reject(err);
                } else {
                    console.log(util.inspect(traces));
                    deferred.resolve(traces);
                }
            });
            return deferred.promise;
    //
        }
    };

};