module.exports = function(searchController, searchRouter) {

    searchRouter.route('/')
        .post(searchController.makeResearch)
        //.get(gpxController.getGpx);

    //gpxRouter.route('/:id')


};