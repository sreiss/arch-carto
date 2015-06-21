var mongoose = require('mongoose'),
    deepcopy = require('deepcopy'),
    Q = require('q'),
    moment = require('moment'),
    ArchError = GLOBAL.ArchError;

exports.name = 'arch-audit-auditEventService';

exports.attach = function(opts) {
    var app = this;

    app.arch.audit = app.arch.audit || {};

    var AuditEvent = app.arch.audit.AuditEvent;
    var validators = app.arch.validators;

    var _hierarchy = {
        AUTHENTICATED: ['AUTHENTICATED'],
        MEMBER: ['AUTHENTICATED', 'MEMBER'],
        ADMIN: ['AUTHENTICATED', 'MEMBER', 'CARTOGRAPHER', 'ADMIN'],
        CARTOGRAPHER: ['AUTHENTICATED', 'MEMBER', 'ADMIN']
    };

    var _events = {
        awaitingAddition: 'AWAITING_ADDITION',
        awaitingUpdate: 'AWAITING_UPDATE',
        awaitingDeletion: 'AWAITING_DELETION',
        added: 'ADDED',
        updated: 'UDPATED',
        deleted: 'DELETED'
    };

    var _pushEvent = function(promise, model, next) {
        promise.then(function(auditEventId) {
                model.properties.auditEvents.unshift(auditEventId);
                next();
            })
            .catch(function(err) {
                next(err);
            });
    };

    var _is = function(user, roleName) {
        if (!_hierarchy[user.role.name]) {
            throw new ArchError('UNKNOWN_ROLE', 500);
        }
        return _.contains(_hierarchy[user.role.name], roleName);
    };

    var auditEventService = app.arch.audit.auditEventService = {
        attachAuditEvents: function(schema, entityName) {
            schema.pre('save', function(next) {
                var model = this;
                if (!model._user) {
                    next(new Error('YOU_MUST_BE_LOGGED_IN_TO_DO_THIS'));
                }
                var user = deepcopy(model._user);
                delete model._user;

                auditEventService.getLastEvent(model.properties.auditEvents)
                    .then(function(lastEvent) {
                        if (model.isNew) {
                            _pushEvent(auditEventService.awaitingAddition(entityName, model, false));
                        } else if (lastEvent !== null) {
                            if (lastEvent.type === _events.awaitingAddition
                                || lastEvent.type === _events.awaitingUpdate
                                || lastEvent.type === _events.awaitingDeletion
                                && !_is(user, _hierarchy.CARTOGRAPHER)) {
                                throw new Error('YOU_DO_NOT_HAVE_THE_RIGHTS_TO_DO_THAT', 403);
                            }

                            if (lastEvent.type === _events.awaitingAddition) {
                                _pushEvent(auditEventService.added(entityName, model, false));
                            } else if (lastEvent.type === _events.awaitingUpdate) {
                                _pushEvent(auditEventService.updated(entityName, model, false));
                            } else {
                                _pushEvent(auditEventService.awaitingUpdate(entityName, model, false));
                            }
                        } else {
                            throw new Error('UNABLE_TO_ATTACH_AUDIT_EVENT', 500);
                        }
                    });
            });

            schema.pre('remove', function(next) {
                var model = this;
                _pushEvent(auditEventService.delete(entityName, model, false));
            });
        },
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
        getLastEvent: function(auditEvents) {
            var deferred = Q.defer();
            if (auditEvents.length > 0) {
                var lastAuditEvent = auditEvents[auditEvents.length - 1];
                if (validators.isObjectId(lastAuditEvent)) {
                    AuditEvent.findOne({_id: lastAuditEvent}, function (err, lastEvent) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(lastEvent);
                        }
                    });
                } else {
                    deferred.resolve(lastAuditEvent);
                }
            } else {
                deferred.resolve(null);
            }
            return deferred.promise;
        },
        canUpdate: function(model) {
            var deferred = Q.defer();

            var auditEvents = model.auditEvents || model.properties.auditEvents;
            if (!auditEvents) {
                deferred.reject(new ArchError('AUDIT_EVENTS_NOT_FOUND'));
            } else {
                auditEventService.getLastEvent(auditEvents)
                    .then(function(lastAuditEvent) {
                        var canNotUdpate = ['AWAITING_UPDATE', 'AWAITING_ADDITION', 'AWAITING_DELETE', 'DELETED'];
                        if (canNotUdpate.indexOf(lastAuditEvent.type) > -1) {
                            deferred.reject(new Error('CANNOT_UPDATE_BECAUSE_' + lastAuditEvent.type));
                        } else {
                            deferred.resolve(true);
                        }
                    })
                    .catch(function(err) {
                       deferred.reject(err);
                    });
            }

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
                entityName: rawAuditEvent.entityName,
                entityId: rawAuditEvent.entityId,
                userId: rawAuditEvent.userId,
                pendingChanges: rawAuditEvent.pendingChanges || {},
                date: moment().toDate()
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

    // adding a shorcut handler for each audit event.
    for (var eventName in _events) {
        auditEventService[eventName] = function(entityName, model, userId) {
            userId = userId || '55140dd309800aa60b882a59';

            var deferred = Q.defer();

            var displayName = _events[eventName];
            return auditEventService.saveAuditEvent({
                type: displayName,
                entityId: model._id,
                entityName: entityName,
                userId: userId,
                pendingChanges: deepcopy(model._doc) || {}
            });
        };
    }
};

exports.init = function(done) {
    return done();
};