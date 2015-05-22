module.exports = function(gpxService) {

    return {
        saveGpx: function(req, res, next) {
            gpxService.saveGpx(req.body)
                .then(function(savedTrace) {
                    res.json({
                        message: 'TRACE_SAVED',
                        value: savedTrace
                    });
                })
                .catch(function(err) {
                    next(err);
                });
        },
        getGpx: function(req, res, next) {
            gpxService.getTrace()
                .then(function(gpx) {
                    // TODO: Better response
                    //res.json({
                    //    message: 'TRACE_RETRIEVED',
                    //    value: gpx
                    //});
                    res.json(gpx);
                })
                .catch(function(err) {
                    next(err);
                });

        }
    };

};