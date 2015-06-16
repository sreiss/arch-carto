'use strict';
angular.module('archCarto', [
    'ngAnimate', 'ngCookies', 'ngTouch',
    'ngSanitize', 'ngMessages', 'ui.router',
    'ngMaterial', 'pascalprecht.translate',
    'leaflet-directive', 'base64',
    'geolocation', 'ngFileUpload', 'btford.socket-io'
  ])
  .config(function ($translateProvider, $stateProvider, $urlRouterProvider, i18nfrFRConstant, i18nenUSConstant, $mdThemingProvider, $httpProvider) {
    L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';
    if (!L.Icon.Default.imagePath) {
      L.Icon.Default.imagePath = 'assets/images';
    }
    //L.Icon.Default.imagePath = 'http://api.tiles.mapbox.com/mapbox.js/v1.0.0beta0.0/images';

    $mdThemingProvider.theme('default')
      .primaryPalette('green')
      .accentPalette('blue-grey');

    $mdThemingProvider.theme('pathDrawer')
      .primaryPalette('teal')
      .accentPalette('blue-grey');

    $stateProvider
      .state('main', {
        url: '',
        abstract: true,
        views: {
          main: {
            templateUrl: 'app/main/main.html'
          }
        }
      })
      .state('main.home', {
        url: '/',
        templateUrl: 'app/main/main-home.html'
      })
      .state('main.subscribe', {
        url: '/subscribe',
        template: '<arch-subscribe></arch-subscribe>'
      })
      .state('main.token', {
        url: '/token/:token',
        templateUrl: 'app/main/main-home.html'
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
        url: '',
        template: ''
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
        controller: 'ArchIdInjectorController'
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
      .state('map.course', {
        url: '/course',
        abstract: true,
        views: {
          mapRight: {
            template: '<arch-course></arch-course>'
          }
        }
      })
      .state('map.course.draw', {
        url: '/:id',
        template: '<arch-course-draw></arch-course-draw>',
        controller: 'ArchIdInjectorController'
      })
      .state('map.memberSpace', {
        url: '/member-space',
        abstract: true,
        views: {
          mapRight: {
            template: '<arch-member-space></arch-member-space>'
          }
        }
      })
      .state('map.memberSpace.ratedCourses', {
        url: '/rated-courses',
        template: '<arch-member-space-rated-courses></arch-member-space-rated-courses>'
      })
      .state('map.memberSpace.courses', {
        url: '/courses',
        template: '<arch-member-space-courses></arch-member-space-courses>'
      })
      .state('map.memberSpace.favoriteCourses', {
        url: '/favorite-courses',
        template: '<arch-member-space-favorite-courses></arch-member-space-favorite-courses>'
      })
      .state('map.memberSpace.personalInfos', {
        url: '/personal-infos',
        template: '<arch-member-space-personal-infos></arch-member-space-personal-infos>'
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
      .state('map.gpx', {
        url: '/gpx',
        views: {
          "mapRight": {
            template: '<arch-gpx-upload-form></arch-gpx-upload-form>'
          }
        }
      })
      .state('map.search', {
        url: '/search',
        views: {
          "mapRight": {
            template: '<arch-search-form></arch-search-form>'
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
            var untranslatedMessage = angular.copy(rejection.data.error.message) || angular.copy(rejection.data.message);
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
