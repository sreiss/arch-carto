'use strict'
angular.module('archCarto')
  .constant('httpConstant', {
    apiUrl: 'http://localhost:3022',
    loginUrl: 'http://localhost:3021',
    casUrl: 'http://localhost:3010',
    clientName: 'ARCH-CARTO',
    clientRedirectUri : 'http://localhost:3012/#/map'
  });
