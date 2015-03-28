'use strict'
angular.module('archCarto')
  .directive('archSubscribe', function (archSubscribeService, $mdToast, $mdDialog, $translate, leafletData, $window) {
    return {
      restrict: 'E',
      templateUrl: 'components/subscribe/arch-subscribe.html',
      controller: function($scope) {
      }
    };
  });
