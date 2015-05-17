'use strict'
angular.module('archCarto')
  .constant('httpConstant', {
    /* PROD */
     apiUrl: 'http://acrobatt-vm11.psi.ad.unistra.fr:3022',
     loginUrl: 'http://acrobatt-vm12.psi.ad.unistra.fr:3010',
     casUrl: 'http://acrobatt-vm12.psi.ad.unistra.fr:3021',
     clientName: 'ARCH-CARTO',
     clientRedirectUri : 'http://acrobatt-vm11.psi.ad.unistra.fr/#/map'
     /**/
    /* DEV
    apiUrl: 'http://localhost:3022',
    loginUrl: 'http://localhost:3010',
    casUrl: 'http://localhost:3021',
    clientName: 'ARCH-CARTO',
    clientRedirectUri : 'http://localhost:3012/#/map'
    */
  });
