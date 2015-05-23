'use strict';
angular.module('archCarto')
  .factory('archSocketService', function(socketFactory, archSocketConstant, $q) {
    var _sockets = [];

    return {
      openSocket: function(path) {
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
      }
  }
  });
