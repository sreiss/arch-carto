module.exports = function(Types) {
    return {
        schema: {
            name: String
        },
        onModelReady: function(PoiType) {
            var poiTypesToUpdate = {
                WATER: null,
                SHELTER: null,
                RESTAURANT: null,
                MONUMENT: null,
                EXCEPTIONNAL: null
            };

            var coatingFilter = function(coating) {
                if (poiTypesToUpdate[coating.name] === null) {
                    return true;
                }
                return false;
            };

            PoiType.find({}, function(err, coatings) {
                if (err) {
                    throw err;
                }

                for (var coatingName in poiTypesToUpdate) {
                    poiTypesToUpdate[coatingName] = coatings.filter(coatingFilter)[0] || null;
                }

                for (var coatingName in poiTypesToUpdate) {
                    var coating = poiTypesToUpdate[coatingName];
                    if (coating === null) {
                        coating = new PoiType({name: coatingName});
                        coating.save(function(err, savedCoating) {
                            if (err) {
                                throw err;
                            } else {
                                console.log('[' + (new Date()) + '] ' + savedCoating.name + ' poi type was added.');
                            }
                        });
                    }
                }
            });
        }
    };
};