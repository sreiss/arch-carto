'use strict'
angular.module('archCarto')
  .constant('httpConstant', {
    apiUrl: 'http://localhost:3002',
    loginUrl: 'http://localhost:3004',
    casUrl: 'http://localhost:3008',
    clientName: 'ARCH-CARTO',
    clientRedirectUri : 'http://localhost:3000/#/map'
  });
