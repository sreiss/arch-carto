var Q = require('q');

module.exports = function(Rating) {

    return {
        get: function(id) {
            var deferred = Q.defer();

            Rating.findById(id, function(err, rating) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(rating);
                }
            });

            return deferred.promise;
        },
        getList: function(query) {
            var deferred = Q.defer();

            var criterias = {};
            if (query.userId !== null) {
                criterias.userId = query.userId;
            }
            if (query.courseId !== null) {
                criterias.courseId = query.courseId;
            }

            Rating.find(criterias, function(err, ratings) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(ratings);
                }
            });

            return deferred.promise;
        },
        save: function(rawRating) {
            var deferred = Q.defer();

            if (rawRating._id) {
                var id = rawRating._id;
                delete rawRating._id;
                delete rawRating.userId;
                Rating.findOneAndUpdate({_id: id}, {$set: rawRating}, function(err, updatedRating) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(updatedRating);
                    }
                });
            } else {
                var rating = new Rating({
                    rate: rawRating.rate,
                    commentary: rawRating.commentary,
                    userId: rawRating.userId,
                    courseId: rawRating.courseId
                });
                rating.save(function(err, savedRating) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(savedRating);
                    }
                });
            }

            return deferred.promise;
        }
    };

};