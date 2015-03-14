module.exports = function() {

  return {
      validateBug: function(req, res, next) {
          next();
      }
  };

};