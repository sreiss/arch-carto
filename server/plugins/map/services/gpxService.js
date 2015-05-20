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
                console.log(JSON.stringify(rawTrace));
                //first version
                //Trace.findByIdAndUpdate(id, { type: 'NTM'}, function (err, newTrace) {
                //    if (err) {
                //        console.log("Error nouveau geojson"+newTrace);
                //        deferred.reject(err);
                //    } else {
                //        console.log("nouveau geojson");
                //        console.log(newTrace);
                //        deferred.resolve(newTrace.features[0].toString());
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
                //            console.log(newTrace);
                //            newTrace.type = "";
                //            newTrace.features[0] = "";
                //            delete newTrace.features;
                //            console.log(newTrace);
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
                        Trace.findByIdAndRemove(id, function(err, newTrace){
                            if (err) {
                                console.log("Error nouveau geojson");
                                deferred.reject(err);
                            } else {
                                console.log('Delete in db');
                            }

                        })
                        modifiedTrace._id = id;
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
                // fourth version yayy
                //var query = { _id: id };
                //Trace.update(query, { type: rawTrace.type }, function(err, rawModified){
                //    console.log(rawModified);
                //});
                //var data = features[0];
                //Trace.update(
                //    { "_id" : id},
                //    {
                //        type: rawTrace.type,
                //        features: [ {geometry: rawTrace.features[0].geometry, properties: rawTrace.features[0].properties, type: rawTrace.features[0].type}]
                //    },
                //    function(err, traceAffected){
                //        if (err) {
                //                    console.log("Error nouveau geojson");
                //                    deferred.reject(err);
                //                } else {
                //                    console.log("nouveau geojson");
                //                    console.log(traceAffected);
                //                    deferred.resolve(traceAffected);
                //                }
                //    });

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
                    console.log(util.inspect(traces));
                    deferred.resolve(traces);
                }
            });
            return deferred.promise;
    //
        }
    };

};