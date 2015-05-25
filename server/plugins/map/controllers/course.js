module.exports = function(courseService) {

    return {
        get: function(req, res, next) {
            courseService.get(req.params.id)
                .then(function(course) {
                    res.json({
                        message: 'COUSE_RETRIEVED',
                        value: course
                    });
                })
                .catch(function(err) {
                    next(err);
                });
        },
        getList: function(req, res, next) {
            courseService.getList()
               .then(function(courses) {
                   res.json({
                       message: 'COURSE_LIST',
                       value: courses
                   });
               })
               .catch(function(err) {
                   next(err);
               });
        },
        save: function(req, res, next) {
            courseService.save(req.body)
                .then(function(savedCourse) {
                    var lastAuditEvent = savedCourse.properties.auditEvents[savedCourse.properties.auditEvents.length - 1];
                    res.json({
                        message: 'COURSE_' + lastAuditEvent.type,
                        value: savedCourse
                    });
                })
                .catch(function(err) {
                   next(err);
                });
        },
        io: {
            save: function(socket, namespace) {
                return function(course) {
                    courseService.save(course)
                        .then(function(savedCourse) {
                            var lastAuditEvent = savedCourse.properties.auditEvents[savedCourse.properties.auditEvents - 1];
                            socket.emit('save', {
                                message: 'COURSE_' + lastAuditEvent.name
                            });
                            if (savedCourse.properties.public === true) {
                                namespace.emit('new', {
                                    message: 'NEW_COURSE',
                                    value: savedCourse
                                });
                            } else {
                                socket.emit('new', {
                                    message: 'NEW_COURSE',
                                    value: savedCourse
                                });
                            }
                        })
                        .catch(function(err) {
                            namespace.emit('error', err);
                        });
                }
            }
        }
    };

};