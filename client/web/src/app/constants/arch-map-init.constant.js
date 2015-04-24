'use strict'
angular.module('archCarto')
  .constant('archMapInitConstant', {
    controls: {
      draw: {

      }
    },
    layers: {
      baselayers: {
        thunderForestLandscape: {
          name: 'Thunder Forest Landscape',
          url: '//{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',
          maxZoom: 18,
          type: 'xyz'
        }
      }
    }
  });
