'use strict'
angular.module('archCarto')
  .constant('httpConstant', {
     /* PROD */
    casClientUrl: 'http://acrobatt-vm12.psi.ad.unistra.fr:3020',
    casServerUrl: 'http://acrobatt-vm12.psi.ad.unistra.fr:3020',
    cartoClientUrl: 'http://acrobatt-vm11.psi.ad.unistra.fr:3022',
    cartoServerUrl: 'http://acrobatt-vm11.psi.ad.unistra.fr:3022',
    clientRedirectUri : 'http://acrobatt-vm11.psi.ad.unistra.fr:3022/#/',

    /* DEV
    casClientUrl: 'http://localhost:3010',
    casServerUrl: 'http://localhost:3020',
    cartoClientUrl: 'http://localhost:3012',
    cartoServerUrl: 'http://localhost:3022',
    clientRedirectUri : 'http://localhost:3012/#/',
    */

    signupType: {
      name: 'CARTO',
      description: 'User of CARTO',
      isPublic: 'false'
    },

    clientName: 'ARCH-CARTO'
  });
