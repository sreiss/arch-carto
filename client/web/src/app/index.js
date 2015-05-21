'use strict';
angular.module('archCarto', [
    'ngAnimate', 'ngCookies', 'ngTouch',
    'ngSanitize', 'ngMessages', 'ui.router',
    'ngMaterial', 'pascalprecht.translate',
    'leaflet-directive', 'base64',
    'geolocation', 'ngFileUpload'
  ])
  .config(function ($translateProvider, $stateProvider, $urlRouterProvider, i18nfrFRConstant, i18nenUSConstant, $mdThemingProvider, $httpProvider) {
    L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';
    if (!L.Icon.Default.imagePath) {
      L.Icon.Default.imagePath = 'assets/images';
    }
    //L.Icon.Default.imagePath = 'http://api.tiles.mapbox.com/mapbox.js/v1.0.0beta0.0/images';

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
            template: '<arch-map class="arch-map"></arch-map>'
          }
        }
      })
      .state('map.home', {
        url: ''
      })
      .state('map.path', {
        url: '/path',
        abstract: true,
        views: {
          mapRight: {
            template: '<arch-path></arch-path>'
          }
        }
      })
      .state('map.path.draw', {
        url: '/:id',
        template: '<arch-path-draw></arch-path-draw>',
        controller: function($scope, $stateParams) {
          if ($stateParams.id != '') {
            $scope.id = $stateParams.id;
          }
        }
      })
      .state('map.marker', {
        url: '/marker',
        abstract: true,
        views: {
          mapRight: {
            template: '<arch-marker></arch-marker>'
          }
        }
      })
      .state('map.marker.choice', {
        url: '',
        template: '<arch-marker-choice></arch-marker-choice>'
      })
      .state('map.marker.poi', {
        url: '/poi',
        template: '<arch-marker-poi></arch-marker-poi>'
      })
      .state('map.marker.bug', {
        url: '/bug',
        template: '<arch-marker-bug></arch-marker-bug>'
      })
      .state('map.marker.media', {
        url: '/media/:type/:id',
        template: '<arch-marker-media></arch-marker-media>'
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
          mapPlugin: {
            template: '<arch-poi></arch-poi>'
          },
          sideNavRight: {
            template: '<arch-map-side-nav-poi-right></arch-map-side-nav-poi-right>'
          }
        }
      })
      .state('map.bug', {
        url: '/bug',
        views: {
          "sideNavRight": {
            //controller: 'ArchBugController',
            template: '<arch-map-side-nav-bug-right></arch-map-side-nav-bug-right>'
          }
        }
      })
      .state('map.gpx', {
        url: '/gpx',
        views: {
          "mapRight": {
            template: '<arch-gpx-upload-form></arch-gpx-upload-form>'
          }
        }
      });
    console.log('State map');


    $urlRouterProvider.otherwise('/');

    $translateProvider
      .translations('fr', i18nfrFRConstant)
      .translations('en', i18nenUSConstant)
      .preferredLanguage('fr');

    $httpProvider.interceptors.push(function($q, archTranslateService, $injector) {
      return {
        'responseError': function (rejection) {
          //debugger;
          if (rejection.data) {
            var $mdToast = $injector.get('$mdToast');
            var untranslatedMessage = angular.copy(rejection.data.message);
            if (untranslatedMessage) {
              return archTranslateService(untranslatedMessage)
                .then(function (translation) {
                  return $mdToast.show({
                    template: '<md-toast class="md-toast arch-toast-error">' + translation + '</md-toast>',
                    hideDelay: 3000,
                    position: 'bottom left'
                  });
                })
                .then(function () {
                  return $q.reject(rejection);
                })
                .catch(function () {
                  return $q.reject(rejection);
                });
            } else {
              return $q.reject(rejection);
            }
          } else {
            return $q.reject(rejection);
          }
        }
      };
    })

  })
;
