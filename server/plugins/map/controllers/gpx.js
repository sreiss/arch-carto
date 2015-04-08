module.exports = function(gpxService) {

    return {
        saveGpx: function(req, res) {
            var gpx = req.file;
            //console.log(gpx);
            res.end("file uploaded");
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