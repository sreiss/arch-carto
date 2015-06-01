'use strict'

angular.module('archCarto')
  .directive('archSearchForm', function($mdToast, $translate, $mdSidenav,leafletData) {
    return {
      restrict: 'E',
      require: '^archMap',
      scope: {
        poi: '=?',
        formValid: '='
      },
      templateUrl: 'components/search/arch-search-form.html',
      controller: function ($scope, httpConstant, archGpxService, archHttpService, $mdSidenav,archSearchService, leafletData) {
        $mdSidenav('right').toggle();
        $mdSidenav('right').open();
        //$scope.myValue = false;
        $scope.hide = function() {
          $scope.myValue = !$scope.myValue;
        };

        var filter = { 'properties': {}};


        // doit etre initialise
        $scope.maxLength = 0;
        $scope.minLength = 0;

        //verifie la valeur pour mettre le deuxieme slider a la valeur minimum
        $scope.$watch(
          function() {
            return $scope.minLength;
          },
          function(newValue, oldValue) {
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
            if(newValue < $scope.minLength)
            {
              $scope.maxLength = $scope.minLength;
            }

          });
        $scope.search = function() {
          leafletData.getMap().then(function (map) {
            var bounds = map.getBounds();
            console.log(bounds.toBBoxString());
            filter.properties.NE = bounds.getNorthEast();
            filter.properties.NW = bounds.getNorthWest();
            filter.properties.SE = bounds.getSouthEast();
            filter.properties.SW = bounds.getSouthWest();
            console.log(filter);
          });
          var commentary = $scope.commentary;
          var difficulty = $scope.difficulty;
          var minLength = $scope.minLength;
          var maxLength = $scope.maxLength;


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
            filter.properties.minLength = minLength *1000;
          }
          if(maxLength)
          {
            filter.properties.maxLength = maxLength * 1000;
          }
          //console.log(filter);
          archSearchService.postSearch(filter).then(function(searchedValue){
            $scope.results = searchedValue.value;
            $scope.myValue = true;
          });

        }
      },
      link: function(scope, element, attrs) {



      }

    }
  })
