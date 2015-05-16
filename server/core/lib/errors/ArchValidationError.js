var ArchValidationError = function (message, status, type) {
    this.message = message || 'An error occcured.';
    this.status = status || 400;
    this.type = type || 'ArchValidationError';
};
ArchValidationError.prototype = Object.create(Error.prototype);
ArchValidationError.prototype.constructor = ArchValidationError;

module.exports = ArchError;