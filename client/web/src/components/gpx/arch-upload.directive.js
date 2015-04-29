'use strict'
angular.module('archCarto')
  .directive('archGpxUploadForm', ['$parse', function ($parse,$mdSidenav) {
  return {
    restrict: 'E',
    scope: {
      poi: '=?',
      formValid: '='
    },
    templateUrl: 'components/gpx/arch-upload-form.html',
    controller: function($scope, httpConstant, FileUploader ,archGpxUploadService,archHttpService, $mdSidenav) {
      $mdSidenav('rightSideNav').toggle();
      $mdSidenav('rightSideNav').open();
      var _gpxUrl = httpConstant.apiUrl + '/map/gpx/';
      console.log(_gpxUrl);
      $scope.uploader = new FileUploader({
        removeAfterUpload: true,
        autoUpload: false,
        //withCredentials: true,
        queueLimit: 1
      });
      $scope.upload = function () {
        $scope.uploader.uploadAll();
      };
      $scope.uploader.onBeforeUploadItem = function (fileItem) {
        $scope.uploadError = null;
        fileItem.url = _gpxUrl;
      };

      $scope.uploader.onAfterAddingFile = function () {
        $scope.uploadError = null;
      };

      $scope.uploader.onErrorItem = function (fileItem) {
        $scope.uploadError = 'Error when uploading the file '+ fileItem.file.name + '.';
      };

      $scope.uploader.onSuccessItem = function () {
      };
      $scope.isUploading = function () {
        return !_.isEmpty($scope.uploader.queue);
      };

    },

    link: function(scope, element, attrs) {

    }
  };
}]);
