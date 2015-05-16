module.exports = {
    isArray: function(value) {
        return Array.isArray(value);
    },
    isObject: function(value) {
        return typeof value === 'object';
    }
};