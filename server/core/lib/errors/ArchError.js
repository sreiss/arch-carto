var ArchError = function (message, status, type) {
    this.message = message || 'An error occcured.';
    this.status = status || 400;
    this.type = type || 'ArchError';
};
ArchError.prototype = Object.create(Error.prototype);
ArchError.prototype.constructor = ArchError;

module.exports = ArchError;