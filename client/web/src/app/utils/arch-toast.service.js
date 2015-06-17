'use strict';
angular.module('archCarto')
  .factory('archToastService', function(archTranslateService, $mdToast)
  {
    return {
      showToast: function(untranslated, type)
      {
        var self = this;

        archTranslateService(untranslated).then(function(translation)
        {
          switch(type)
          {
            case 'success':
                return self.showToastSuccess(translation);
                break;
            case 'error':
                return self.showToastError(translation);
                break;
            default:
                return self.showToastDefault(translation);
                break;
          }
        });
      },

      showToastDefault: function(translation)
      {
        return $mdToast.show($mdToast.simple().content(translation));
      },

      showToastSuccess: function(translation)
      {
        return $mdToast.show(
        {
          template: '<md-toast class="md-toast arch-toast-success">' + translation + '</md-toast>',
          hideDelay: 3000,
          position: 'bottom left'
        });
      },

      showToastError: function(translation)
      {
        return $mdToast.show(
          {
          template: '<md-toast class="md-toast arch-toast-error">' + translation + '</md-toast>',
          hideDelay: 3000,
          position: 'bottom left'
        });
      }
    };
  });
