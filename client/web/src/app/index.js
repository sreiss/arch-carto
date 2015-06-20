'use strict';
angular.module('archCarto', [
    'ngAnimate', 'ngCookies', 'ngTouch',
    'ngSanitize', 'ngMessages', 'ui.router',
    'ngMaterial', 'pascalprecht.translate',
    'leaflet-directive', 'base64',
    'geolocation', 'ngFileUpload', 'btford.socket-io',
    'angular-md5'
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
            var archToastService = $injector.get('archToastService');
            var untranslatedMessage = angular.copy(rejection.data.message) || angular.copy(rejection.data.error.message);
            if (untranslatedMessage) {
              archToastService.showToast(untranslatedMessage, 'error');
              $q.reject(rejection);
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
  .run(function($translate) {
    $translate([
      "CANCEL_DRAWING",
      "CANCEL",
      "DELETE_LAST_POINT_DRAWN",
      "DELETE_LAST_POINT",
      "DRAW_A_POLYLINE",
      "DRAW_A_POLYGON",
      "DRAW_A_RECTANGLE",
      "DRAW_A_CIRCLE",
      "DRAW_A_MARKER",
      "CLICK_AND_DRAG_TO_DRAW_CIRCLE",
      "RADIUS",
      "CLICK_MAP_TO_PLACE_MARKER",
      "CLICK_TO_START_DRAWING_SHAPE",
      "CLICK_TO_CONTINUE_DRAWING_SHAPE",
      "CLICK_FIRST_POINT_TO_CLOSE_THIS_SHAPE",
      "SHAPE_EDGES_CANNOT_CROSS",
      "CLICK_TO_START_DRAWING_LINE",
      "CLICK_TO_CONTINUE_DRAWING_LINE",
      "CLICK_LAST_POINT_TO_FINISH_LINE",
      "CLICK_AND_DRAG_TO_DRAW_RECTANGLE",
      "RELEASE_MOUSE_TO_FINISH_DRAWING",
      "SAVE_CHANGES",
      "SAVE",
      "CANCEL_EDITING_DISCARDS_ALL_CHANGES",
      "CANCEL",
      "EDIT_LAYERS",
      "NO_LAYERS_TO_EDIT",
      "DELETE_LAYERS",
      "NO_LAYERS_TO_DELETE",
      "DRAG_HANDLES_OR_MARKER_TO_EDIT_FEATURE",
      "CLICK_CANCEL_TO_UNDO_CHANGES",
      "CLICK_ON_A_FEATURE_TO_REMOVE"
    ])
      .then(function(translations) {
        L.drawLocal = {
          draw: {
            toolbar: {
              actions: {
                title: translations.CANCEL_DRAWING,
                text: translations.CANCEL
              },
              undo: {
                title: translations.DELETE_LAST_POINT_DRAWN,
                text: translations.DELETE_LAST_POINT
              },
              buttons: {
                polyline: translations.DRAW_A_POLYLINE,
                polygon: translations.DRAW_A_POLYGON,
                rectangle: translations.DRAW_A_RECTANGLE,
                circle: translations.DRAW_A_CIRCLE,
                marker: translations.DRAW_A_MARKER
              }
            },
            handlers: {
              circle: {
                tooltip: {
                  start: translations.CLICK_AND_DRAG_TO_DRAW_CIRCLE
                },
                radius: translations.RADIUS
              },
              marker: {
                tooltip: {
                  start: translations.CLICK_MAP_TO_PLACE_MARKER
                }
              },
              polygon: {
                tooltip: {
                  start: translations.CLICK_TO_START_DRAWING_SHAPE,
                  cont: translations.CLICK_TO_CONTINUE_DRAWING_SHAPE,
                  end: translations.CLICK_FIRST_POINT_TO_CLOSE_THIS_SHAPE
                }
              },
              polyline: {
                error: translations.SHAPE_EDGES_CANNOT_CROSS,
                tooltip: {
                  start: translations.CLICK_TO_START_DRAWING_LINE,
                  cont: translations.CLICK_TO_CONTINUE_DRAWING_LINE,
                  end: translations.CLICK_LAST_POINT_TO_FINISH_LINE
                }
              },
              rectangle: {
                tooltip: {
                  start: translations.CLICK_AND_DRAG_TO_DRAW_RECTANGLE
                }
              },
              simpleshape: {
                tooltip: {
                  end: translations.RELEASE_MOUSE_TO_FINISH_DRAWING
                }
              }
            }
          },
          edit: {
            toolbar: {
              actions: {
                save: {
                  title: translations.SAVE_CHANGES,
                  text: translations.SAVE
                },
                cancel: {
                  title: translations.CANCEL_EDITING_DISCARDS_ALL_CHANGES,
                  text: translations.CANCEL
                }
              },
              buttons: {
                edit: translations.EDIT_LAYERS,
                editDisabled: translations.NO_LAYERS_TO_EDIT,
                remove: translations.DELETE_LAYERS,
                removeDisabled: translations.NO_LAYERS_TO_DELETE
              }
            },
            handlers: {
              edit: {
                tooltip: {
                  text: translations.DRAG_HANDLES_OR_MARKER_TO_EDIT_FEATURE,
                  subtext: translations.CLICK_CANCEL_TO_UNDO_CHANGES
                }
              },
              remove: {
                tooltip: {
                  text: translations.CLICK_ON_A_FEATURE_TO_REMOVE
                }
              }
            }
          }
        };
      });
  })
;
