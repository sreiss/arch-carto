var storage = require('filestorage');

module.exports = function(qService) {

    return {
        addStorage: function(pluginName, storageName) {
            var deferred = qService.defer();
            if (!pluginName) {
                deferred.reject(new Error('You must provide a pluginName to add a storage'));
            }
            if (!storageName) {
                deferred.reject(new Error('You must provide a storage name to add a storage'));
            }
            try {
                var storageDir = path.join(__dirname, '..', '..', 'uploads', 'plugins', pluginName, storageName);
                storage.create(storageDir);
                deferred.resolve(true);
            } catch(e) {
                deferred.reject(e);
            }
            return deferred.promise;
        }
    };

};