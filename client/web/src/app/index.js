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
        abstract: true,
        views: {
          main: {
            template: '<arch-map layout="column" layout-fill></arch-map>'
          }
        }
      })
      .state('map.home', {
        url: '',
        views: {
          sideNavLeft: {
            template: '<arch-map-side-nav-left></arch-map-side-nav-left>'
          }
        }
      })
      /*
      .state('map.center', {
        url: '/center',
        views: {
          sideNavLeft: {
            template: '<arch-map-side-nav-center-left></arch-map-side-nav-center-left>'
          },
          sideNavRight: {
            template: '<arch-map-side-nav-center-right></arch-map-side-nav-center-right>'
          }
        }
      })
      */
      .state('map.poi', {
        url: '/poi',
        views: {
          sideNavLeft: {
            template: '<arch-map-side-nav-poi-left></arch-map-side-nav-poi-left>'
          },
          sideNavRight: {
            template: '<arch-map-side-nav-poi-right></arch-map-side-nav-poi-right>'
          }
        }
      })
      .state('map.bug', {
        url: '/bug',
        views: {
          sideNavRight: {
            controller: 'ArchBugController',
            template: '<arch-map-side-nav-bug-right></arch-map-side-nav-bug-right>'
          }
        }
      })
      .state('map.path', {
        url: '/path',
        views: {
          sideNavLeft: {
            template: '<arch-map-side-nav-path-left></arch-map-side-nav-path-left>'
          }
        }
      })
      .state('map.gpx', {
        url: '/path',
        views: {
          sideNavLeft: {
            template: '<arch-gpx-upload-form></arch-gpx-upload-form>'
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
