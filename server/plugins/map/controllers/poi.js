module.exports = function (poiService) {

    return {
        getPoi: function(req, res) {
            if (req.params.id) {
                poiService.getPoi(req.params.id)
                    .then(function(poi) {
                        res.json(poi);
                    }, function(err) {
                        res.json(err.message);
                    });
            } else {
                poiService.getAllPois()
                    .then(function(pois) {
                        res.json(pois);
                    }, function(err) {
                        res.json(err.message);
                    });
            }
        },
        savePoi: function(req, res) {
            var poi = req.body;
            if (poi) {
                poiService.savePoi(poi)
                    .then(function(poi) {
                        res.json('POI ' + poi.name + ' saved');
                    })
                    .catch(function(err) {
                        console.error(err);
                        res.status(500)
                            .json('An error occured: ' + err.message);
                    });
            }
        },
        deletePoi: function(req, res) {
            poiService.deletePoi(req.params.id)
                .then(function(poi) {
                    res.json('Poi ' + poi.name + ' deleted!');
                }, function(err) {
                    res.json(err.message);
                });
        }
    };

};

