var Q = require('q');
var fs = require ('fs');
var path = require('path');
var util = require('util');
//var jsdom = require('jsdom').jsdom;
var togeojson = require('togeojson');

module.exports = function (Trace) {

    //return {};

    return {
        saveGpx: function(gpxFile, options) {
            var deferred = Q.defer();
            var trace = new Trace();
            trace.type = gpxFile.type;
            trace.features[0] = gpxFile.features[0];
            trace.save(function(err) {
                if (err) {
                    console.log('Ca marche pas');
                    deferred.reject(err);
                }
                console.log('Save in db');
                deferred.resolve(trace);
            })
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
                    //console.log(traces);
                }
            });
            return deferred.promise;
    //
        }
    };

};