var mongoose = require('mongoose'),
    moment = require('moment');

exports.name = 'arch-audit-auditEvent';

exports.attach = function(opts) {
    var app = this;

    app.arch.audit = app.arch.audit || {};

    var auditEventSchema = mongoose.Schema({
        type: {type: String, required: true},
        entity: {type: String, required: true},
        entityId: {type: mongoose.Schema.Types.ObjectId, required: true},
        userId: {type: mongoose.Schema.Types.ObjectId, required: true},
        date: {type: Date, required: true}
    });

    auditEventSchema.pre('save', function(next) {
        this.date = moment().toDate();
        next();
    });

    var AuditEvent = app.arch.audit.AuditEvent = mongoose.model('AuditEvent', auditEventSchema);

    AuditEvent.schema
        .path('type')
        .validate(function(value) {
            return /ADDED|UPDATED|DELETED|AWAITING_DELETION|AWAITING_ADDITION|AWAITING_UPDATE/i.test(value);
        }, 'Invalid audit event type');
};

exports.init = function(done) {
    return done();
};