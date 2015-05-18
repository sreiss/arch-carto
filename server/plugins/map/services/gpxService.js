var Q = require('q');
var fs = require ('fs');
var path = require('path');
var util = require('util');
//var jsdom = require('jsdom').jsdom;
var togeojson = require('togeojson');

module.exports = function (Trace) {

    //return {};

    return {
        saveGpx: function(rawTrace, options) {
            var deferred = Q.defer();
            if (rawTrace._id) {
                console.log("saveGpx");
                //console.log(rawTrace);

                var id = rawTrace._id;

                delete rawTrace._id;
                console.log(rawTrace);
                //first version
                //Trace.findByIdAndUpdate(id, rawTrace, function (err, traceNew) {
                //    if (err) {
                //        console.log("Error nouveau geojson");
                //        deferred.reject(err);
                //    } else {
                //        console.log("nouveau geojson");
                //        console.log(traceNew);
                //        deferred.resolve(traceNew);
                //    }
                //});
                //second version should work
                //http://stackoverflow.com/questions/5024787/update-model-with-mongoose-express-nodejs
                //Trace.findById(id, function (err, newTrace) {
                //        if (err) {
                //            console.log("Error nouveau geojson");
                //            deferred.reject(err);
                //        } else {
                //            console.log("nouveau geojson");
                //            newTrace.type = rawTrace.type;
                //            newTrace.features[0] = rawTrace.features[0];
                //            newTrace.save(function(err) {
                //                if (err) {
                //                    console.log('Ca marche pas');
                //                    deferred.reject(err);
                //                }
                //                console.log('Save in db');
                //                console.log(JSON.stringify(newTrace));
                //                deferred.resolve(newTrace);
                //            })
                //        }
                //    });
                // third save correctly the new geoJson but another id
                Trace.findById(id).lean().exec(function(err, newTrace){
                    if (err) {
                        console.log("Error nouveau geojson");
                        deferred.reject(err);
                    } else {
                        var modifiedTrace = new Trace();
                        console.log("Coming from");
                        console.log(JSON.stringify(newTrace));
                        modifiedTrace.type = rawTrace.type;
                        modifiedTrace.features[0] = rawTrace.features[0];
                        modifiedTrace.save(function(err) {
                            if (err) {
                                console.log('Ca marche pas');
                                deferred.reject(err);
                            }
                            console.log('Save in db');
                            console.log(JSON.stringify(newTrace));
                            deferred.resolve(newTrace);
                        })
                    }
                });

                //console.log("juste avanat ke create");
                //Trace.create({id},trace.type,trace.features[0],function (err, trace) {
                //    if (err) {
                //        console.log("Erreur nouveau geojson");
                //
                //        deferred.reject(err);
                //    } else {
                //        console.log("nouveau geojson");
                //        console.log(trace);
                //        deferred.resolve(trace);
                //    }
                //});
            } else {
                var trace = new Trace();
                trace.type = rawTrace.type;
                trace.features[0] = rawTrace.features[0];
                trace.save(function(err) {
                    if (err) {
                        console.log('Ca marche pas');
                        deferred.reject(err);
                    }
                    console.log('Save in db');
                    deferred.resolve(trace);
                })

            }
            return deferred.promise;

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
                }
            });
            return deferred.promise;
    //
        }
    };

};