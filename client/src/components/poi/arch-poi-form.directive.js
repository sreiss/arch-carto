'use strict'
angular.module('archCarto')
  .directive('archPoiForm', function(archPoiService, archPoiTypeService, $filter) {
    return {
      restrict: 'E',
      scope: {
        poi: '=?',
        formValid: '='
      },
      templateUrl: 'components/poi/arch-poi-form.html',
      link: function(scope, element, attributes) {
        scope.formValid = false;
        scope.poi = scope.poi || {};

        scope.poiTypes = [];

        archPoiTypeService.getPoiTypeList(function(result) {
          scope.poi.type = scope.poi.type || result[0];
          scope.poiTypes = result;
        });

        scope.addPoiType = function(poiTypeName) {
          var poiType = {
            name: poiTypeName
          };
          archPoiTypeService.savePoiType(poiType, function(result) {
            scope.poi.type = result;
            if (($filter('filter')(scope.poiTypes, result.name, 'strict')).length == 0) {
              scope.poiTypes.push(result);
            }
            scope.newPoiTypeName = '';
          });
        };

        scope.$watch('poiForm.$valid', function(valid) {
          if (valid) {
            scope.formValid = true;
          } else {
            scope.formValid = false;
          }
        }, true);
      }
    };
  });
