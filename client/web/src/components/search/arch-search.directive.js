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
          var name = $scope.keywords;
          var filter = {name: name};
          archSearchService.postSearch(filter).then(function(searchedValue){
            $scope.result = searchedValue;
          });

        }
      },
      link: function(scope, element, attrs) {


      }

    }
  })
