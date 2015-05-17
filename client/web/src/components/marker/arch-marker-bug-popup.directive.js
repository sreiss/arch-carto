'use strict'
angular.module('archCarto')
  .directive('archMarkerBugPopup', function(archMarkerBugService) {
    return {
      restrict: 'E',
      templateUrl: 'components/marker/arch-marker-bug-popup.html',
      link: function(scope, element, attributes) {
        var refreshBug = function() {
          archMarkerBugService.get(scope.bugId)
            .then(function (result) {
              scope.bug = result.value;
            });
        };
        refreshBug();
      }
    }
  });
