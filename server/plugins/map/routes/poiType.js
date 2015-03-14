module.exports = function(poiTypeController, poiTypeRouter) {

    poiTypeRouter.route('/')
        .get(poiTypeController.getPoiTypeList)
        .post(poiTypeController.savePoiType);

};