angular.module('starter.controllers', ['ionic', 'ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('addPOICtrl', function($scope, $cordovaCamera, $cordovaFile, $cordovaGeolocation) {
	$scope.image = ""; 
    $scope.initAddImage = function() {
        var options = {
            destinationType : Camera.DestinationType.FILE_URI,
            sourceType : Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
            allowEdit : false,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions
        };
	
        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.image = imageData;
        });
    }

    $scope.getGPSposition = function() {
        var posOptions = {
            timeout: 10000, 
            enableHighAccuracy: false
        };

        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
              $scope.lat = position.coords.latitude;
              $scope.long = position.coords.longitude;
              $scope.alt = position.coords.altitude;
            }, function(err) {
                $scope.err = "err : "+err.code+"  "+err.message;
        });
    }
})

.controller('searchPOICtrl', function($scope) {

})

.controller('myPOICtrl', function($scope) {

})

.controller('settingsCtrl', function($scope) {

});
