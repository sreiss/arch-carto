module.exports = function(archRatingService) {

    return {
        get: function(req, res, next) {
            archRatingService.get(req.params.id)
                .then(function(rating) {
                    res.json({
                        message: 'RATING_RETRIEVED',
                        value: rating
                    });
                })
                .catch(function(err) {
                    next(err);
                });
        },
        getList: function(req, res, next) {
            archRatingService.getList({
                    courseId: req.query['course-id'] || null,
                    userId: req.query['user-id'] || null
                })
                .then(function(ratings) {
                    res.json({
                        message: 'RATING_LIST',
                        value: ratings
                    });
                })
                .catch(function(err) {
                    next(err);
                });
        },
        save: function(req, res, next) {
            var isUpdate = !!req.body._id;
            archRatingService.save(req.body)
                .then(function(savedRating) {
                    if (isUpdate) {
                        res.json({
                            message: 'RATING_UDPATED',
                            value: savedRating
                        });
                    } else {
                        res.json({
                            message: 'RATING_SAVED',
                            value: savedRating
                        });
                    }
                })
                .catch(function(err) {
                    next(err);
                });
        },
        io: {
            save: function(socket, namespace) {
                return function(rating) {
                    var isUpdate = !!rating._id;
                    archRatingService.save(rating)
                        .then(function(savedRating) {
                            if (!isUpdate) {
                                socket.emit('save', {
                                    message: 'RATING_SAVED'
                                });
                                namespace.emit('new', {
                                    message: 'NEW_RATING',
                                    value: savedRating
                                })
                            } else {
                                socket.emit('update', {
                                    message: 'RATING_UPDATED'
                                });
                                namespace.emit('update', {
                                    message: 'RATING_UPDATED',
                                    value: savedRating
                                })
                            }
                        })
                        .catch(function(err) {
                            socket.emit('archError', {
                               message: err.message
                            });
                        });
                };
            }
        }
    };

};