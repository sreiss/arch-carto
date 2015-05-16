var ArchError = GLOBAL.ArchError;

module.exports = function() {

    return function(req, res, next) {

        var errors = req.validationErrors();
        if (errors) {
            var error = new ArchError(errors[0].msg);
            res.status(error.status).json({ message: error.message });
            return;
        }
        return next();

    };

};