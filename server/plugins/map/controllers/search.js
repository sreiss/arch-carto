module.exports = function(searchService) {

    return {
        makeResearch: function(req, res, next) {
            searchService.makeResearch(req.body)
                .then(function(searchResult) {
                    res.json({
                        message: 'SEARCH_MADE',
                        value: searchResult
                    });
                })
                .catch(function(err) {
                    next(err);
                });
        }
    };

};