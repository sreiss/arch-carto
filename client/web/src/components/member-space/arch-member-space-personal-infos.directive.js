'use strict';
angular.module('archCarto')
  .directive('archMemberSpacePersonalInfos', function(archAccountService, $mdToast)
  {
    return {
      restrict: 'E',
      require: '^archMap',
      templateUrl: 'components/member-space/arch-member-space-personal-infos.html',
      link: function(scope, element, attributes, archMap)
      {
        archMap.setDisplayOptions({
          mapRight: {
            width: 'extra'
          }
        });

        scope.oauthUser = {};
        archAccountService.getCurrentUser().then(function(user)
        {
          scope.oauthUser = user;
          scope.oauthUser.password = '';
          scope.oauthUser.confirm = '';
        })
        .catch(function()
        {
          console.log('Unable to get current user.');
        });

        scope.updatePersonalInfos = function()
        {
          console.log(scope.oauthUser);

          if((scope.oauthUser.password.length > 0 || scope.oauthUser.confirm.length > 0 )&& scope.oauthUser.password != scope.oauthUser.confirm)
          {
            $mdToast.show($mdToast.simple().content('Password not egal.'));
          }
          else
          {
            $mdToast.show($mdToast.simple().content('Profil successflly updated.'));
          }
        };
      }
    }
  });
