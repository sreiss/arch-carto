var Q = require('q');

module.exports = function(Poi, poiTypeService) {

    return {
        getPoi: function(id) {
            var deferred = Q.defer();
            Poi.find({_id: id})
                .populate('type')
                .exec(function (err, poi) {
                    if (err) {
                        deferred.reject(err);
                    }
                    if (poi == null) {
                        deferred.reject(new Error('Poi ' + id + ' not found'));
                    }
                    deferred.resolve(poi);
                });
            return deferred.promise;
        },
        getAllPois: function() {
            var deferred = Q.defer();
            Poi.find()
                .populate('type')
                .exec(function (err, pois) {
                    if (err) {
                        deferred.reject(err);
                    }
                    if (pois.length == 0) {
                        deferred.reject(new Error('No pois found'));
                    }
                    deferred.resolve(pois);
                });
            return deferred.promise;
        },
        savePoi: function(rawPoi) {
            var deferred = Q.defer();

            var poi = new Poi();
            poi.name = rawPoi.name;
            poi.description = rawPoi.description;
            poi.coordinates = rawPoi.coordinates;

            poiTypeService.getPoiType(rawPoi.type.name)
                .then(function(poiType) {
                    if (poiType == null) {
                        poiType = poiTypeService.savePoiType(rawPoi.type);
                    }
                    return poiType;
                })
                .then(function(dbPoiType) {
                    poi.type = dbPoiType;
                    poi.save(function(err) {
                        if (err) {
                            deferred.reject(err);
                        }
                        deferred.resolve(poi);
                    })
                });

            return deferred.promise;
        },
        deletePoi: function(id) {
            var deferred = Q.defer();
            Poi.findByIdAndRemove(id, function(err, poi) {
                if (err) {
                    deferred.reject(err);
                }

                if (poi == null) {
                    deferred.reject(new Error('Poi ' + id + ' not found'));
                }
                deferred.resolve(poi);
            });
            return deferred.promise;
        }
    };

}
