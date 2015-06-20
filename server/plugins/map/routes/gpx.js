module.exports = function(gpxController, gpxRouter, authMiddleware)
{
    gpxRouter.route('/')
        .post(authMiddleware.authenticate)
        .post(gpxController.saveGpx)
        .get(gpxController.getGpx);
};