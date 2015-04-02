'use strict';
angular.module('archCarto', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ui.router', 'ngMaterial', 'pascalprecht.translate', 'leaflet-directive', 'angularFileUpload', 'base64'])
  .config(function ($translateProvider, $stateProvider, $urlRouterProvider, i18nfrFRConstant, i18nenUSConstant, $mdThemingProvider) {
    L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';

    $mdThemingProvider.theme('default')
      .primaryPalette('green')
      .accentPalette('lime');

    $mdThemingProvider.theme('pathDrawer')
      .primaryPalette('teal')
      .accentPalette('blue-grey');

    $stateProvider
      .state('main', {
        url: '/',
        views: {
          main: {
            templateUrl: 'app/main/main.html'
          }
        }
      })
      .state('map', {
        url: '/map',
        views: {
          main: {
            template: '<arch-map></arch-map>'
          },
          'sideNav@': {
            template: '<arch-side-nav-default></arch-side-nav-default>'
          }
        }
      })
      .state('map.poi', {
        url: '/poi',
        views: {
          'sideNav@': {
            template: '<arch-side-nav-poi></arch-side-nav-poi>'
          }
        }
      })
      .state('map.bug', {
        url: '/bug',
        views: {
          'sideNav@': {
            template: '<arch-side-nav-bug></arch-side-nav-bug>'
          }
        }
      });


    $urlRouterProvider.otherwise('/');

    $translateProvider
      .translations('fr', i18nfrFRConstant)
      .translations('en', i18nenUSConstant)
      .preferredLanguage('fr');
  })
;
