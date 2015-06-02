var Q = require('q'),
    ArchError = GLOBAL.ArchError;

module.exports = function(Course, User) {

    return {
        get: function(id) {
            var deferred = Q.defer();
            Course.findOne({_id: id})
                .populate({
                    path: 'properties.auditEvents',
                    limit: 1
                })
                .exec(function(err, course) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(course);
                    }
                });
            return deferred.promise;
        },
        getList: function(criterias) {
            var deferred = Q.defer();
            criterias = criterias || {
                'properties.public': true
            };
            Course.find(criterias)
                .populate({
                    path: 'properties.auditEvents',
                    limit: 1
                })
                .exec(function(err, courses) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(courses);
                    }
                });
            return deferred.promise;
        },
        save: function(rawCourse) {
            var deferred = Q.defer();
            if (rawCourse._id) {
                Course.findByIdAndUpdate(rawCourse._id, course, function(err, updatedCourse) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(updatedCourse);
                    }
                });
            } else {
                var course = new Course({
                    properties: {
                        commentary: rawCourse.properties.commentary,
                        public: rawCourse.properties.public,
                        difficulty: rawCourse.properties.difficulty,
                        length: rawCourse.properties.length
                    },
                    geometry: {
                        coordinates: rawCourse.geometry.coordinates
                    }
                    //features: rawCourse.properties.features || []
                });
                course.save(function(err, savedCourse) {
                   if (err) {
                       deferred.reject(err);
                   } else {
                       deferred.resolve(savedCourse);
                   }
                });
            }
            return deferred.promise;
        },
        saveFavorite: function(id, userId) {
            var deferred = Q.defer();
            User.findById(userId, function(err, user) {
                user.favoriteCourses.push(id);
                if (err) {
                    deferred.reject(err);
                } else if (!user) {
                    deferred.reject(new ArchError('USER_NOT_FOUND', 404));
                } else {
                    user.save(function (err, savedUser) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(true);
                        }
                    });
                }
            });
            return deferred.promise;
        },
        getFavoriteList: function(userId) {
            var deferred = Q.defer();
            User.findById(userId, function(err, user) {
                if (err) {
                    deferred.reject(err);
                } else if (!user) {
                    deferred.reject(new ArchError('USER_NOT_FOUND', 404));
                } else {
                    var favoriteIds = user.favoriteCourses;
                    for (var i = 0; i < favoriteIds.length; i += 1) {
                        Course.find({_id: {$id: favoriteIds[i]}}, function(err, favorites) {
                            if (err) {
                                deferred.reject(err);
                            } else {
                                deferred.resolve(favorites);
                            }
                        });
                    }
                }
            });
            return deferred.promise;
        },
        deleteFavorite: function(id, userId) {
            var deferred = Q.defer();
            User.findOne({_id: userId}, function(err, user) {
                if (err) {
                    deferred.reject(err);
                } else if (!user) {
                    deferred.reject(new ArchError('USER_NOT_FOUND', 404));
                } else {
                    if (user.favoriteCourses.indexOf(id) > -1) {
                        var index = user.favoriteCourses.indexOf(id);
                        user.favoriteCourses.splice(index, 1);
                        user.save(function(err, savedUser) {
                            if (err) {
                                deferred.reject(err);
                            } else {
                                deferred.resolve(true);
                            }
                        });
                    } else {
                        deferred.reject(new ArchError('USER_DID_NOT_FAVORITE_THIS', 404));
                    }
                }
            });
            return deferred.promise;
        }
    };

};