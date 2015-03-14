'use strict'
angular.module('archCarto')
  .factory('archMapDialogService', function($mdDialog, archHttpService, $q, $timeout) {
    return {
      showCenterDialog: function(coordinates) {
        return $mdDialog.show({
          templateUrl: 'components/map/arch-map-center-dialog.html',
          controller: function($scope) {
            $scope.center = {};
            $scope.location = {};
            $scope.selectedTab = 0;

            if (coordinates) {
              $scope.center.latitude = coordinates.latitude;
              $scope.center.longitude = coordinates.longitude;
            }

            $scope.getMatchLocations = function(search) {
              return archHttpService.get('http://open.mapquestapi.com/nominatim/v1/search.php', {
                params: {
                  format: 'json',
                  q: search,
                  limit: 5
                }
              });
            };

            $scope.cancel = function() {
              $mdDialog.cancel();
            };
            $scope.extractCenter = function(item) {
              $scope.center.latitude = parseFloat(item.lat);
              $scope.center.longitude = parseFloat(item.lon);
            };
            $scope.chooseCenter = function(coordinates) {
              $mdDialog.hide(coordinates);
            };
            $scope.hasCenter = function() {
              return $scope.center && $scope.center.latitude && $scope.center.longitude;
            }
          }
        });
      },
      showActionDialog: function() {
        return $mdDialog.show({
          templateUrl: 'components/map/arch-map-action-dialog.html',
          controller: function($scope) {
            $scope.selectAction = function(action) {
              $mdDialog.hide(action);
            };
            $scope.cancel = function() {
              $mdDialog.cancel();
            };
          }
        });
      },
      showPoiDialog: function(coordinates) {
        return $mdDialog.show({
          templateUrl: 'components/map/arch-map-poi-dialog.html',
          controller: function($scope) {
            $scope.poi = {
              coordinates: coordinates
            };
            $scope.formValid = false;

            $scope.cancel = function() {
              $mdDialog.cancel();
            };
            $scope.savePoi = function(poi) {
              $mdDialog.hide(poi);
            };
          }
        });
      },
      showBugDialog: function(coordinates) {
        return $mdDialog.show({
          templateUrl: 'components/map/arch-map-bug-dialog.html',
          controller: function($scope) {
            $scope.bug = {
              coordinates: coordinates
            };

            $scope.cancel = function() {
              $mdDialog.cancel();
            };
            $scope.reportBug = function(bug) {
              $mdDialog.hide(bug);
            };
          }
        });
      },
      showGpxDialog: function() {
        return $mdDialog.show({
          templateUrl: 'components/map/arch-map-gpx-dialog.html',
          controller: function($scope) {

          }
        });
      }
    };
  });
