var Q = require('q');

module.exports = function(Course) {

    return {
        get: function(id) {
            var deferred = Q.defer();
            Course.findOne(id)
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
                        difficulty: rawCourse.properties.difficulty
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
        }
    };

};