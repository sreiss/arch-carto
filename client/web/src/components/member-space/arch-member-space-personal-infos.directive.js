'use strict';
angular.module('archCarto')
  .directive('archMemberSpacePersonalInfos', function(archAccountService, archMemberSpacePersonalInfosService, archToastService, md5)
  {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/member-space/arch-member-space-personal-infos.html',
      link: function(scope, element, attributes, archMap)
      {
        archMap.setDisplayOptions(
        {
          mapRight:
          {
            width: 'extra'
          }
        });

        archMemberSpacePersonalInfosService.getPersonalInfos().then(function(profile)
        {
          scope.profile = profile;
        });

        scope.updatePersonalInfos = function()
        {
          if((scope.profile.user.newPassword.length > 0 || scope.profile.user.confirmNewPassword.length > 0 )&& scope.profile.user.newPassword != scope.profile.user.confirmNewPassword)
          {
            archToastService.showToast('PERSONAL_INFOS_FORM_PASSWORD_DIFFERENT', 'error');
          }
          else
          {
            if(scope.profile.user.newPassword.length > 0 && scope.profile.user.confirmNewPassword.length > 0)
            {
              scope.profile.user.password = md5.createHash(scope.profile.user.newPassword);
            }

            archMemberSpacePersonalInfosService.updatePersonalInfos(scope.profile).then(function(result)
            {
              archToastService.showToast('PERSONAL_INFOS_FORM_UPDATE_SUCCESS', 'success');
              archAccountService.updateToken(scope.profile);
            })
            .catch(function()
            {
              archToastService.showToast('PERSONAL_INFOS_FORM_UPDATE_FAIL', 'error');
            });
          }
        };
      }
    }
  });
