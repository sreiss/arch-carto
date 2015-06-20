module.exports = function(searchController, searchRouter)
{
    searchRouter.route('/')
        .post(searchController.makeResearch)
};