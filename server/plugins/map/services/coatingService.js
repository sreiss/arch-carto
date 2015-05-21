var Q = require('q');

module.exports = function(Coating) {

    return {
        getList: function() {
            var deferred = Q.defer();

            Coating.find()
                .exec(function(err, coatings) {
                   if (err) {
                       deferred.reject(err);
                   } else {
                       deferred.resolve(coatings);
                   }
                });

            return deferred.promise;
        },
        save: function(rawCoating) {
            var deferred = Q.defer();

            if (rawCoating._id) {
                var id = rawCoating._id;
                delete rawCoating._id;
                Coating.findByIdAndUpdate(id, function(err, updatedCoating) {
                    if (err) {
                       deferred.reject(err);
                    } else {
                        deferred.resolve(updatedCoating);
                    }
                });
            } else {
                try {
                    var coating = new Coating({
                        name: rawCoating.name
                    });
                    coating.save(function(err, savedCoating) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(savedCoating);
                        }
                    });
                } catch(err) {
                    deferred.reject(err);
                }
            }

            return deferred.promise;
        }
    };

};