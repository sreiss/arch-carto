'use strict'
angular.module('archCarto')
  .factory(function($translate) {

    return function(toTranslate) {
      $translate(toTranslate)
        .catch(function(err) {
          return toTranslate;
        })
        .then(function(translation) {
          return translation;
        });
    };

  });
