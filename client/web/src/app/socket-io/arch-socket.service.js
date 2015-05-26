'use strict';
angular.module('archCarto')
  .factory('archSocketService', function(socketFactory, archSocketConstant, $q, $mdToast, $mdSidenav, $log, archLayerService, archTranslateService) {
    var _sockets = [];

    return {
      openSocket: function(path, service) {
        if (io) {
          var ioSocket = io.connect(archSocketConstant.url + path);

          _sockets[path] = socketFactory({
            ioSocket: ioSocket
          });

          return _sockets[path];
        }
        else {
          throw new Error('Unable to intiate socket with ' + archSocketConstant.url);
        }
      },
      initService: function(service, path) {
        if (_sockets[path]) {
          var socketService = angular.extend(service, {
            save: function (entity) {
              _sockets[path].emit('save', entity);
            },
            messages: function (callback) {
              _sockets[path].on('save', callback);
            },
            error: function (callback) {
              _sockets[path].on('archError', callback);
            },
            onUpdate: function (callback) {
              _sockets[path].on('new', callback);
            }
          });

          // If the socket you use has no custom logic.
          socketService.useDefaultHandlers = function(layerName, optionName) {
            socketService.messages(function(result) {
              $mdToast.show($mdToast.simple().content(result.message));
              $mdSidenav('right').close();
            });
            socketService.error(function(err) {
              $log.error(err);
              archTranslateService(err.message)
                .then(function (translation) {
                  return $mdToast.show({
                    template: '<md-toast class="md-toast arch-toast-error">' + translation + '</md-toast>',
                    hideDelay: 3000,
                    position: 'bottom left'
                  });
                });
            });
            socketService.onUpdate(function(result) {
              archLayerService.addLayers(layerName, optionName, result.value);
            });
          };

          return socketService;
        } else {
          throw new Error('Socket for "' + path + '" not found');
        }
      }
     }
  });
