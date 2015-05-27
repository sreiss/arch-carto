'use strict';
angular.module('archCarto')
  .controller('ArchIdInjectorController', function($scope, $stateParams) {
    if ($stateParams.id != '') {
      $scope.id = $stateParams.id;
    }
  });
