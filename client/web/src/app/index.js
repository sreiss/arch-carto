'use strict';
angular.module('archCarto', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngRoute', 'ngMaterial', 'pascalprecht.translate', 'leaflet-directive', 'angularFileUpload', 'base64'])
  .config(function ($translateProvider, $routeProvider, i18nfrFRConstant, i18nenUSConstant, $mdThemingProvider) {
    L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';

    $mdThemingProvider.theme('default')
      .primaryPalette('green')
      .accentPalette('lime');

    $mdThemingProvider.theme('pathDrawer')
      .primaryPalette('teal')
      .accentPalette('blue-grey');

    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html'
      })
      .when('/map', {
        templateUrl: 'app/map/map.html'
      })
      .otherwise({
        redirectTo: '/'
      });

    $translateProvider
      .translations('fr', i18nfrFRConstant)
      .translations('en', i18nenUSConstant)
      .preferredLanguage('fr');
  })
;
