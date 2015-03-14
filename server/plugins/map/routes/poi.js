module.exports = function(poiController, poiRouter) {

    poiRouter.route('/')
        .get(poiController.getPoi)
        .post(poiController.savePoi);

    poiRouter.route('/:id')
        .get(poiController.getPoi)
        .delete(poiController.deletePoi);

};