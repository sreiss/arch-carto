'use strict';
angular.module('archCarto')
  .directive('archMemberSpace', function($mdSidenav, $state) {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/member-space/arch-member-space.html',
      link: function(scope)
      {
        scope.tabs =
        [
          {label: 'COURSES_I_RATED', state: 'map.memberSpace.ratedCourses'},
          {label: 'MY_COURSES', state: 'map.memberSpace.courses'},
          {label: 'MY_FAVORITE_COURSES', state: 'map.memberSpace.favoriteCourses'},
          {label: 'PERSONAL_INFOS', state: 'map.memberSpace.personalInfos'}
        ];

        scope.go = function(tab)
        {
          $state.go(tab.state);
        };

        $mdSidenav('right').open().then(function()
        {
          console.log('Member space panel opened.');
        });

        scope.cancel = function()
        {
          $mdSidenav('right').close().then(function()
          {
            $state.go('map.home');
            console.log('Member space panel closed.');
          });
        }
      }
    }
  });
