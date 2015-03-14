module.exports = function(gpxController, gpxRouter) {

    gpxRouter.route('/')
        .post(gpxController.saveGpx)
        .get(gpxController.getGpx);

    //gpxRouter.route('/:id')


};