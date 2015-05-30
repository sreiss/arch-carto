module.exports = function(courseService, crudControllerFactory) {

    return crudControllerFactory('COURSE', courseService);
    /*
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
            var isUpdate = !!req.body._id;
            courseService.save(req.body)
                .then(function(savedCourse) {
                    var lastAuditEvent = savedCourse.properties.auditEvents[savedCourse.properties.auditEvents.length - 1];
                    res.json({
                        message: 'COURSE_' + lastAuditEvent.type,
                        value: savedCourse
                    });
                    if (!isUpdate) {
                        req.archIo.namespace.emit('save', {
                            message: 'NEW_COURSE',
                            value: savedCourse
                        });
                    } else {
                        req.archIo.namespace.emit('update', {
                            message: 'COURSE_UPDATE',
                            value: savedCourse
                        });
                    }
                })
                .catch(function(err) {
                   next(err);
                });
        }/*,
        io: {
            save: function(socket, namespace) {
                return function(course) {
                    var isUpdate = !!course._id;
                    courseService.save(course)
                        .then(function(savedCourse) {
                            var lastAuditEvent = savedCourse.properties.auditEvents[savedCourse.properties.auditEvents.length - 1];
                            socket.emit('save', {
                                message: 'COURSE_' + lastAuditEvent.type
                            });
                            if (savedCourse.properties.public === true) {
                                if (!isUpdate) {
                                    namespace.emit('new', {
                                        message: 'NEW_COURSE',
                                        value: savedCourse
                                    });
                                } else {
                                    namespace.emit('update', {
                                        message: 'COURSE_UDPATED',
                                        value: savedCourse
                                    });
                                }
                            } else {
                                if (!isUpdate) {
                                    socket.emit('new', {
                                        message: 'NEW_COURSE',
                                        value: savedCourse
                                    });
                                } else {
                                    socket.emit('update', {
                                        message: 'COURSE_UPDATED',
                                        value: savedCourse
                                    });
                                }
                            }
                        })
                        .catch(function(err) {
                            socket.emit('archError', {
                                message: err.message
                            });
                        });
                }
            }
        }
    };*/

};