angular.module('starter.controllers', ['ionic', 'ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('addPOICtrl', function($scope, $cordovaCamera, $cordovaFile) {
	$scope.image = "";
    $scope.test = "Lauching Camera !";
    
    $scope.initAddImage = function() {
        var options = {
            destinationType : Camera.DestinationType.FILE_URI,
            sourceType : Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
            allowEdit : false,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true
        };
	
        $cordovaCamera.getPicture(options).then(function(imageData) {
 
            onImageSuccess(imageData);
            $scope.filedestination = imageData;
     
            function onImageSuccess(fileURI) {
                createFileEntry(fileURI);
            }
     
            function createFileEntry(fileURI) {
                window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
            }
 
            function copyFile(fileEntry) {
                var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                var newName = makeid() + name;
     
                window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
                    fileEntry.copyTo(
                        fileSystem2,
                        newName,
                        onCopySuccess,
                        fail
                    );
                },
                fail);
            }
		
            function onCopySuccess(entry) {
                $scope.$apply(function () {
                    $scope.image = entry.nativeURL;
                });
            }
 
            function fail(error) {
                console.log("fail: " + error.code);
            }
     
            function makeid() {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
     
                for (var i=0; i < 5; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            }
 
        }, function(err) {
            console.log(err);
        });
    }
 
    $scope.urlForImage = function(imageName) {
        if (imageName != "") {
            var name = imageName.substr(imageName.lastIndexOf('/') + 1);
            var trueOrigin = cordova.file.dataDirectory + name;
            $scope.test = "Ta mere";
            return trueOrigin;
        }

        else {
            $scope.test = "Prout";
        }
    }
})

.controller('searchPOICtrl', function($scope) {

})

.controller('settingsCtrl', function($scope) {

});
