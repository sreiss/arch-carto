'use strict';
angular.module('archCarto')
  .factory('archSocketService', function(socketFactory, archSocketConstant, $q, $mdToast, $mdSidenav, $log, archLayerService, archTranslateService) {
    var _sockets = [];

    return {
      openSocket: function(name, path) {
        if (io) {
          var ioSocket = io.connect(archSocketConstant.url + path);

          _sockets[name] = socketFactory({
            ioSocket: ioSocket
          });

          return _sockets[name];
        }
        else {
          throw new Error('Unable to intiate socket with ' + archSocketConstant.url);
        }
      },
      initService: function(name, service) {
        if (_sockets[name]) {
          var socketService = {
            /*save: function (entity) {
              _sockets[name].emit('save', entity);
            },*/
            error: function (callback) {
              _sockets[name].on('archError', callback);
              _sockets[name].on('error', callback);
            },
            onNew: function (callback) {
              _sockets[name].on('new', callback);
            },
            onUpdate: function(callback) {
              _sockets[name].on('update', callback);
            }
          };

          // If the socket you use has no custom logic.
          socketService.useDefaultHandlers = function(layerName, optionName) {
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
            socketService.onNew(function(result) {
              archLayerService.addLayers(layerName, optionName, result.value);
            });
          };

          return angular.extend(socketService, service);
        } else {
          throw new Error('Socket for "' + name + '" not found');
        }
      }
     }
  });
