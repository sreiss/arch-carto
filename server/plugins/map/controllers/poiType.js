module.exports = function (poiTypeService) {

    return {
        getPoiTypeList: function(req, res) {
            poiTypeService.getPoiTypeList()
                .then(function(poiTypeList) {
                    res.json(poiTypeList);
                });
        },
        savePoiType: function(req, res) {
            var poiType = req.body;
            poiTypeService.savePoiType(poiType)
                .then(function(savedPoiType) {
                    res.json(savedPoiType);
                });
        }
    };
    
};
