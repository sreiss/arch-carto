var camelCase = require('camel-case');

module.exports = function(auditService) {

    return {
        getList: function(req, res, next) {
            var criterias = {};
            for (var paramName in req.query) {
                var normilizedName = camelCase(paramName);
                var value = req.query[paramName];
                criterias[normilizedName] = value;
            };
            auditService.getList(criterias)
                .then(function(auditEvents) {
                    res.json({
                        message: 'AUDIT_EVENT_LIST',
                        value: auditEvents
                    });
                })
                .catch(function(err) {
                    next(err);
                });
        }
    };

};