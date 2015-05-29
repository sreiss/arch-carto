'use strict'

angular.module('archCarto')
  .directive('archSearchForm', function($mdToast, $translate, $mdSidenav) {
    return {
      restrict: 'E',
      scope: {
        poi: '=?',
        formValid: '='
      },
      templateUrl: 'components/search/arch-search-form.html',
      controller: function ($scope, httpConstant, archGpxService, archHttpService, $mdSidenav,archSearchService) {
        $mdSidenav('right').toggle();
        $mdSidenav('right').open();
        $scope.search = function() {
          var commentary = $scope.commentary;
          var difficulty = $scope.difficulty;
          var filter = { 'properties': {}};
          if(commentary)
          {
            filter.properties.commentary = commentary;
          }
          if(difficulty)
          {
            filter.properties.difficulty = difficulty;
          }
          console.log(filter);
          archSearchService.postSearch(filter).then(function(searchedValue){
            $scope.result = searchedValue.value;
          });

        }
      },
      link: function(scope, element, attrs) {


      }

    }
  })
