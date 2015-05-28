var Q = require('q')
    path = require('path'),
    fs = require('fs'),
    moment = require('moment');

var mediasUrl = 'uploads/medias/';
var mediasPath = path.join(__dirname, '..', '..', '..', 'uploads', 'medias');
try {
    fs.mkdirSync(mediasPath);
    console.log('Medias directory created.');
} catch(err) {
    console.log('Medias directory already created.');
}

module.exports = function(Media) {

    return {
        save: function(rawMedia) {
            var deferred = Q.defer();
            if (rawMedia._id) {
                rawMedia.findByIdAndUpdate(rawMedia._id, function(err, media) {

                });
            } else {
                var fileName = moment().format('YYYYMMDDHHmmss') + '-' + rawMedia.body.name + path.extname(rawMedia.files.file.name);
                var filePath = path.join(mediasPath, fileName);

                fs.readFile(rawMedia.files.file.path, function(err, data) {

                    if (err) {
                        deferred.reject(err);
                    } else {
                        fs.writeFile(filePath, data, function (err) {
                            if (err) {
                                deferred.reject(err);
                            } else {
                                try {
                                    var media = new Media({
                                        name: rawMedia.body.name,
                                        description: rawMedia.body.description,
                                        url: mediasUrl + fileName
                                    });
                                    media.save(function (err, savedMedia) {
                                        if (err) {
                                            fs.unlinkSync(filePath);
                                            deferred.reject(err);
                                        } else {
                                            deferred.resolve(savedMedia);
                                        }
                                    });
                                } catch(err) {
                                    fs.unlinkSync(filePath);
                                    deferred.reject(err);
                                }
                            }
                        });
                    }
                });

            }
            return deferred.promise;
        }
    }

};