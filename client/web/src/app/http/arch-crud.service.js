'use strict';
angular.module('archCarto')
  .factory('archCrudService', function(archHttpService, $mdToast, $mdSidenav, archTranslateService) {
    var _crudServices = {};

    return {
      initService: function(name, service, url) {
        var crudService = angular.extend(service, {
          get: function(id) {
            return archHttpService.get(url + '/' + id);
          },
          getList: function(criterias) {
            criterias = criterias || {};
            return archHttpService.get(url, {
              params: criterias
            });
          },
          save: function(entity) {
            return archHttpService.post(url, entity)
              .then(function(result) {
                archTranslateService(result.message)
                  .then(function(translation) {
                    $mdToast.show($mdToast.simple().content(translation));
                    $mdSidenav('right').close();
                  });
                return result;
              });
          },
          delete: function(id) {
            return archHttpService.delete(url + '/' + id)
              .then(function(result) {
                archTranslateService(result.message)
                  .then(function(translation) {
                    $mdToast.show($mdToast.simple().content(translation));
                    $mdSidenav('right').close();
                  });
                return result;
              });
          }
        });

        _crudServices[name] = crudService;
        return crudService;
      }
    };
  });
