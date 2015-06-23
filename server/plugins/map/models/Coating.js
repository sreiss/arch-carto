module.exports = function(Types) {

    return {
        schema: {
            name: {type: String, required: true}
        },
        onModelReady: function(Coating) {
            var coatingsToUpate = {
                ROAD: null,
                DIRT_ROAD: null,
                BEATEN_PATH: null,
                SINGLE: null
            };

            var coatingFilter = function(coating) {
                if (coatingsToUpate[coating.name] === null) {
                    return true;
                }
                return false;
            };

            Coating.find({}, function(err, coatings) {
                if (err) {
                    throw err;
                }

                for (var coatingName in coatingsToUpate) {
                    coatingsToUpate[coatingName] = coatings.filter(coatingFilter)[0] || null;
                }

                for (var coatingName in coatingsToUpate) {
                    var coating = coatingsToUpate[coatingName];
                    if (coating === null) {
                        coating = new Coating({name: coatingName});
                        coating.save(function(err, savedCoating) {
                            if (err) {
                                throw err;
                            } else {
                                console.log('[' + (new Date()) + '] ' + savedCoating.name + ' role was added.');
                            }
                        });
                    }
                }
            });
        }
    };

};