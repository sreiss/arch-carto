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
          //more complex
          var name = $scope.keywords;
          var filter = {name: name};
          archSearchService.postSearch(filter);


          // easy way
          //archGpxService.getTrace()
          //  .then(function (traces) {
          //    for(var i = 0; i<traces.length; i++)
          //    {
          //      var name = traces[i].features[0].properties.name;
          //      var search = $scope.keywords;
          //      if(name == search)
          //      {
          //        $scope.result = traces[i].features[0].properties.name;
          //        debugger;
          //
          //      }
          //      else
          //      {
          //        debugger;
          //
          //      }
          //    }
          //  });
        }
      },
      link: function(scope, element, attrs) {
        //second version
        //scope.i
        //console.log(attrs.$normalize);
        //scope.upload = archGpxUploadSer

      }

    }
  })
