module.exports = function(auditEventService) {

    return {
        getList: function(criterias) {
            return auditEventService.getAuditEvents(criterias);
        }
    };

};