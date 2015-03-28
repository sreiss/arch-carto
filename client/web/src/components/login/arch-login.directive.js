'use strict'
angular.module('archCarto')
  .directive('archLogin', function (archLoginService, $translate, $window, httpConstant) {
    return {
      restrict: 'A',
      templateUrl: 'components/login/arch-login.html',
      controller: function($scope, $cookieStore, $base64) {
        var init = function()
        {
          // Check token in coockies.
          var token = $cookieStore.get('token');

          if(!token)
          {
            $scope.alreadyLogged = false;
            console.log('INIT : Not connected');

            var cookieClientId = $cookieStore.get('clientId') || '';
            var cookieClientSecret = $cookieStore.get('clientSecret') || '';
            var cookieClientRedirectUri = $cookieStore.get('clientRedirectUri') || '';
            var cookieClientHash = $cookieStore.get('clientHash') || '';

            // If no saved in cookies, save new client.
            if(cookieClientId.length == 0 || cookieClientSecret.length == 0 || cookieClientRedirectUri.length == 0 || cookieClientHash.length == 0)
            {
              console.log('INIT : Params not found in cookies, save new client.');

              archLoginService.saveClient().then(function(result)
              {
                console.log('INIT : Params saved in cookies.');

                var clientHash = $base64.encode(result.data.clientId + ':' + result.data.clientSecret);
                $cookieStore.put('clientId', result.data.clientId);
                $cookieStore.put('clientSecret', result.data.clientSecret);
                $cookieStore.put('clientRedirectUri', result.data.clientRedirectUri);
                $cookieStore.put('clientHash', clientHash);

                $scope.loginUrl = httpConstant.loginUrl + '/#/?clientHash=' + clientHash + '&clientRedirectUri=' + $base64.encode(result.data.clientRedirectUri);
              });
            }
            else
            {
              console.log('INIT : Params found in cookies.');
              $scope.loginUrl = httpConstant.loginUrl + '/#/?clientHash=' + cookieClientHash + '&clientRedirectUri=' + $base64.encode(cookieClientRedirectUri);
            }
          }
          else
          {
            console.log('INIT : Already connected.');

            $scope.alreadyLogged = true;
            $scope.mapUrl = '/#/map';
          }
        }();
      }
    };
  });
