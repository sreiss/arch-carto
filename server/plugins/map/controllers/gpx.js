module.exports = function(gpxService) {

    return {
        saveGpx: function(req, res) {
                var gpx = req.body;
            console.log("controller gpx");
            console.log(gpx);
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