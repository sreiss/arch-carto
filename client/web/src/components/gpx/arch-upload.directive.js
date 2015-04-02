'use strict'
angular.module('archCarto')
  .directive('archGpxUploadForm', ['$parse', function ($parse) {
  return {
    restrict: 'E',
    scope: {
      poi: '=?',
      formValid: '='
    },
    templateUrl: 'components/gpx/arch-upload-form.html',
    controller: function($scope, httpConstant, FileUploader ,archGpxUploadService,archHttpService) {
      var _gpxUrl = httpConstant.apiUrl + '/map/gpx';
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
        // Example: close the current model dialog when the upload succeeds
        //$modalInstance.dismiss();
        // Example: reload the current screen (using route) when the upload succeeds
        //$route.reload();
        console.log('CA MARCHE');
      };
      $scope.isUploading = function () {
        return !_.isEmpty($scope.uploader.queue);
      };
      //$scope.uploadGpx = function(gpx) {
      //  archGpxUploadService.uploadFileToUrl(gpx);
      //};

      //console.log(_gpxUrl);
      //$scope.uploadFile = function(files) {
      //  var fd = new FormData();
      //  console.log(files[0].name);
      //  //Take the first selected file
      //  fd.append("file", files);
      //
      //
      //  archHttpService.post(_gpxUrl, fd, {
      //    //withCredentials: true,
      //    transformRequest: angular.identity,
      //    headers: {'Content-Type': undefined }
      //
      //  });
      //  console.log('I have done my job');
      //};
      //$scope.uploader = new FileUploader({
      //  removeAfterUpload: true,
      //  url: _gpxUrl,
      //  autoUpload: false,
      //  //withCredentials: true,
      //  headers: 'Access-Control-Allow-Origin: *',
      //  queueLimit: 1
      //});
      //$scope.upload = function (fileItem) {
      //  console.log('Je veux upload');
      //  //archGpxUploadService.uploadFileToUrl()
      //  $scope.uploader.uploadAll();
      //};
      //$scope.uploader.onBeforeUploadItem = function (fileItem) {
      //  $scope.uploadError = null;
      //  console.log(fileItem.file.name);
      //  archGpxUploadService.uploadFileToUrl(fileItem);
      //
      //  //fileItem.url = _gpxUrl;
      //};
      //$scope.uploader.onAfterAddingFile = function () {
      //  $scope.uploadError = null;
      //};
      //$scope.uploader.onErrorItem = function (fileItem) {
      //  $scope.uploadError = 'Error when uploading the file '+ fileItem.file.name + '.'+fileItem.file.headers;
      //    //$scope.uploadError = fileItem.file;
      //};
      //$scope.uploader.onSuccessItem = function () {
      //  console.log('CA MARCHE');
      //  // Example: close the current model dialog when the upload succeeds
      //  $modalInstance.dismiss();
      //  // Example: reload the current screen (using route) when the upload succeeds
      //  $route.reload();
      //};
      //$scope.uploader.onCompleteItem = function (){
      //  console.log('G FINI ALORS QUE JE MARCHE PAS');
      //}
      //$scope.isUploading = function () {
      //  console.log('CA MARCHE isUPLOADING');
      //  return !_.isEmpty($scope.uploader.queue);
      //};
    },

    link: function(scope, element, attrs) {
      //var model = $parse(attrs.fileModel);
      //var modelSetter = model.assign;
      //
      //element.bind('change', function(){
      //  scope.$apply(function(){
      //    modelSetter(scope, element[0].files[0]);
      //  });
      //});
    }
  };
}]);
