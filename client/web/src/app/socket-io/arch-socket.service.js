'use strict';
angular.module('archCarto')
  .factory('archSocketService', function(socketFactory, archSocketConstant, $q, $mdToast, $mdSidenav, $log, archLayerService) {
    var _sockets = [];

    return {
      openSocket: function(path, service) {
        if (io) {
          var ioSocket = io.connect(archSocketConstant.url + path);

          _sockets[path] = socketFactory({
            ioSocket: ioSocket
          });

          _sockets[path].forward('error');

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
              _sockets[path].on('error', callback);
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
              $mdToast.show($mdToast.simple().content(err.message));
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
