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

        // doit etre initialise
        $scope.maxLength = 0;
        $scope.minLength = 0;

        //verifie la valeur pour mettre le deuxieme slider a la valeur minimum
        $scope.$watch(
          function() {
            return $scope.minLength;
          },
          function(newValue, oldValue) {
            $mdToast.show($mdToast.simple().content("Slider=" + newValue).position("top right").hideDelay(50));
            console.log($scope.maxLength);
            if($scope.maxLength < newValue)
            {
              $scope.maxLength = newValue;
            }

          });
        //ne pas laisser le slider aller en dessous du slider minimum
        $scope.$watch(
          function() {
            return $scope.maxLength;
          },
          function(newValue, oldValue) {
            console.log($scope.maxLength);
            if(newValue < $scope.minLength)
            {
              $scope.maxLength = $scope.minLength;
            }

          });
        $scope.search = function() {
          var commentary = $scope.commentary;
          var difficulty = $scope.difficulty;
          var minLength = $scope.minLength;
          var maxLength = $scope.maxLength;


          var filter = { 'properties': {}};
          if(commentary)
          {
            filter.properties.commentary = commentary;
          }
          if(difficulty)
          {
            filter.properties.difficulty = difficulty;
          }
          if(minLength)
          {
            filter.properties.minLength = minLength;
          }
          if(maxLength)
          {
            filter.properties.maxLength = maxLength;
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
