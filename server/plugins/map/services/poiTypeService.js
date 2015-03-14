var Q = require('q');

module.exports = function(PoiType) {

    return {
        getPoiTypeList: function(callback) {
            var deferred = Q.defer();

            PoiType.find(function(err, res) {
                if (err) {
                    deferred.reject(err);
                }
                deferred.resolve(res);
            });

            return deferred.promise;
        },
        getPoiType: function(name) {
            var deferred = Q.defer();

            PoiType.findOne({name: name}, function(err, res) {
                if (err) {
                    deferred.reject(err);
                }
                deferred.resolve(res);
            });

            return deferred.promise;
        },
        savePoiType: function(rawPoiType) {
            var deferred = Q.defer();

            PoiType.findOne({name: rawPoiType.name}, function(err, res) {
                if (err) {
                    deferred.reject(err);
                }
                if (res != null)
                {
                    deferred.resolve(res);
                }
                else
                {
                    var poiType = new PoiType();
                    poiType.name = rawPoiType.name;
                    poiType.save(function(err) {
                        if (err) {
                            deferred.reject(err);
                        }
                        deferred.resolve(poiType);
                    })
                }
            });

            return deferred.promise;
        }
    };

};
