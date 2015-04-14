module.exports = function(gpxService) {

    return {
        saveGpx: function(req, res) {
            var gpx = req.file;
            gpxService.saveGpx(gpx).then(function(savedTrace) {
                res.json({message: 'Trace saved!'});
            })
                .catch(function(err) {
                    res.send(err);
                });;
            res.end("Trace uploaded");
        },
        getGpx: function(req, res) {
            gpxService.getTrace()
                    .then(function(gpx) {
                        res.json(gpx);
                    })
                    .catch(function(err) {
                        res.send(err);
                    });

        }
    };

};