var mongoose = require('mongoose'),
    Q = require('q');

exports.name = 'arch-audit-auditEventService';

exports.attach = function(opts) {
    var app = this;

    app.arch.audit = app.arch.audit || {};

    var AuditEvent = app.arch.audit.AuditEvent;

    app.arch.audit.auditEventService = {
        getAuditEvents: function(criteria) {
            var deferred = Q.defer();
            criteria = criteria || {};
            AuditEvent.find(criteria, function(err, auditEvents) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(auditEvents);
                }
            });
            return deferred.promise;
        },
        /**
         * Sauvegarde l'évènement d'audit passé en paramètre et renvoie son id.
         * @param rawAuditEvent
         * @returns {jQuery.promise|promise.promise|d.promise|promise|.ready.promise|Q.promise|*}
         */
        saveAuditEvent: function(rawAuditEvent) {
            var deferred = Q.defer();

            //TODO: Remove the hard coded "userId"
            rawAuditEvent.userId = "553945a76221442a26c1f150";

            var auditEvent = new AuditEvent({
                type: rawAuditEvent.type,
                entityId: rawAuditEvent.entityId,
                entity: rawAuditEvent.entity,
                userId: rawAuditEvent.userId,
                pendingChanges: rawAuditEvent.pendingChanges || {}
            });
            auditEvent.save(function(err, savedAuditEvent) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(savedAuditEvent._id);
                }
            });
            return deferred.promise;
        }
    };
};

exports.init = function(done) {
    return done();
};