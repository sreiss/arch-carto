angular.module('starter.controllers', ['ionic', 'ngCordova'])

.controller('AppCtrl', function ($cordovaSQLite, $scope, $cordovaGeolocation, $ionicSideMenuDelegate) {  
  $scope.initBadge = function () {
      var posOptions = {
          timeout: 1000, 
          enableHighAccuracy: true
      };
      
      var queryCreateTable = "CREATE TABLE IF NOT EXISTS temp (id INTEGER PRIMARY KEY ASC, pointType TEXT, name TEXT, type TEXT, image TEXT, description TEXT, coor_long TEXT, coor_lat TEXT)";
      
      var queryCountRow = "SELECT * FROM temp";
      
      $scope.$watch(
        function() {
          return $ionicSideMenuDelegate.isOpen()
        }, 
        function(value) { 
          var db = $cordovaSQLite.openDB("temp_data_appli_POI");

          $cordovaSQLite.execute(db, queryCreateTable)
          .then(function(res) {
              console.log("table created => for side menu");
          }, function (err) {
              console.log(err);
          });

          $cordovaSQLite.execute(db, queryCountRow).then(function(res) {
              $scope.notif = res.rows.length;
          }, function (err) {
              console.log(err);
          });  
      });
    }
    
    $scope.initBadge();
})

.controller('addPOICtrl', function($scope, $cordovaSQLite, $cordovaToast, $cordovaNetwork, $cordovaCamera, $cordovaFile, $cordovaGeolocation, $http,  $cordovaFileTransfer) { 
  $scope.image = ""; 
  $scope.hide=false;
  $http.get('http://acrobatt-vm11.psi.ad.unistra.fr:3022/map/poi-type').
      success(function (data, status, headers, config) {
          $scope.poiTypeArray = data;
      });

  $scope.initAddImage = function() {
      var options = {
          destinationType : Camera.DestinationType.FILE_URI,
          sourceType : Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
          allowEdit : false,
          encodingType: Camera.EncodingType.JPEG,
          popoverOptions: CameraPopoverOptions
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
          $scope.image = imageData;
      });
  }

  $scope.addPOI = function () {
    $scope.hide=true;  
    var lati = 0;
    var longi = 0;

    var posOptions = {
        timeout: 10000, 
        enableHighAccuracy: true
    };

    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
      var lati = position.coords.latitude;
      var longi = position.coords.longitude;

      if ($cordovaNetwork.isOffline()) {
        var db = $cordovaSQLite.openDB("temp_data_appli_POI");
        var query = "CREATE TABLE IF NOT EXISTS temp (id INTEGER PRIMARY KEY ASC, pointType TEXT, name TEXT, type TEXT, image TEXT, description TEXT, coor_long TEXT, coor_lat TEXT)";
        $cordovaSQLite.execute(db, query)
        .then(function(res) {
          console.log("table created");
        }, function (err) {
          console.log(err);
        });

        var query = "INSERT INTO temp (pointType,name,type,image,description, coor_long, coor_lat) VALUES (?,?,?,?,?,?,?)";

        $cordovaSQLite.execute(db, query, [
          "POI", 
          $scope.poiname, 
          $scope.poitype,
          $scope.image,
          $scope.poidesc, 
          longi, 
          lati])
        .then(function(res) {
          console.log("insertId: " + res.insertId);
          $cordovaToast.showLongBottom("POI ajouté localement. Vous pourrez l'ajouter une fois que vous aurez du réseau").then(function(success) {}, function (error) {});
        }, function (err) {
          console.error(err);
        });

        $scope.hide=false;
      } else {
        var url = "http://acrobatt-vm11.psi.ad.unistra.fr:3022/map/media";
        var targetPath = $scope.image;
        var trustHosts = true
        var options = {
          params:{
            name:$scope.poiname,
            description:$scope.desc
          }
        };

        $cordovaFileTransfer.upload(url, targetPath, options, trustHosts)
        .then(function(data, status) {
          var idMedia = JSON.parse(data["response"])["value"]["_id"];

          $http.post('http://acrobatt-vm11.psi.ad.unistra.fr:3022/map/poi', {
            properties:{
              name:$scope.poiname
              ,type:$scope.poitype
              ,medias:[idMedia]
              ,description:$scope.poidesc
            },
            geometry:{
              coordinates:[
                longi
                ,lati
              ]
            }
          }).success(function(data, status, headers, config) {
            $cordovaToast.showLongBottom("POI ajouté.").then(function(success) {}, function (error) {});
          }).error(function(data, status, headers, config) {
            $cordovaToast.showLongBottom("Ajout du POI échoué.").then(function(success) {}, function (error) {});
          });
        }, function (err) {
          $cordovaToast.showLongBottom("Upload de l'image échoué.").then(function(success) {}, function (error) {});
          console.log(err);
        });

        $scope.hide=false;
      }
    }, function(err) {
      $cordovaToast.showLongBottom("Problème de localisation, aucune coordonnées GPS n'as été trouvé.").then(function(success) {}, function (error) {});
      $scope.hide=false;
    });
  }
})

.controller('searchPOICtrl', function($scope, $cordovaSQLite, $cordovaGeolocation, $http, $cordovaToast) { 
  var lati = 0;
  var longi = 0;
  var radiusDetection = 0;
  $scope.state = "hide";

  var posOptions = {
      timeout: 10000, 
      enableHighAccuracy: true
  };
  
  var errorFunction = function (err) {
    console.log(err);
    $scope.state = "empty";
  }
  
  $scope.getPOI = function () {
      $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
        lati = position.coords.latitude;
        longi = position.coords.longitude;

        var db = $cordovaSQLite.openDB("temp_data_appli_POI");

        var queryCreateTable = "CREATE TABLE IF NOT EXISTS tempOptions (id INTEGER PRIMARY KEY ASC, key TEXT, value TEXT)";
        $cordovaSQLite.execute(db, queryCreateTable)
        .then(function(res) {

          var selectRadius = "SELECT key, value FROM tempOptions where key = 'radius'";
          $cordovaSQLite.execute(db, selectRadius)
          .then(function(res) {
            if(res.rows.length == 0) {

              var queryInsertRadius = "INSERT INTO tempOptions (key, value) VALUES ('radius', '30')";
              $cordovaSQLite.execute(db, queryInsertRadius)
              .then(function(res) {
                console.log("radius initialize at 30");
                radiusDetection = 30;
              }, errorFunction);
            } else {      
              radiusDetection = res.rows.item(0).value;
              console.log(radiusDetection);
            }

            $http.get('http://acrobatt-vm11.psi.ad.unistra.fr:3022/map/poi', {
              params: {
                'with-medias': true,
                'lat': lati,
                'lng': longi,
                'radius': radiusDetection
              }
            })  
            .success(function(data, status, headers, config) {
              $scope.state = "full";
              
              console.log(data.value[2].properties.name);
              console.log(data.value);
              $scope.poiProximity = data.value;
              $scope.longeur = data.value.length;
            })
            .error(function(data, status, headers, config) {
              alert("get POI KO");
              $scope.state = "empty";
            }); 
          }, errorFunction);
        }, errorFunction);
    }, function(err) {
      $cordovaToast.showLongBottom("Problème de localisation, aucune coordonnées GPS n'as été trouvé.").then(function(success) {}, function (error) {});
    });
  }
  
  $scope.getPOI();
})

.controller('bugCtrl', function($scope, $ionicSideMenuDelegate, $cordovaGeolocation, $http, $cordovaSQLite, $cordovaNetwork, $cordovaToast) {
  
  $scope.hide=false;

  $scope.addBug = function () {
      $scope.hide=true;

      var lati = 0;
      var longi = 0;

      var posOptions = {
          timeout: 10000, 
          enableHighAccuracy: true
      };

      $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
          lati = position.coords.latitude;
          longi = position.coords.longitude;

          if ($cordovaNetwork.isOffline()) {
              var db = $cordovaSQLite.openDB("temp_data_appli_POI");
              var query = "CREATE TABLE IF NOT EXISTS temp (id INTEGER PRIMARY KEY ASC, pointType TEXT, name TEXT, type TEXT, image TEXT, description TEXT, coor_long TEXT, coor_lat TEXT)";
              $cordovaSQLite.execute(db, query)
              .then(function(res) {
                  console.log("table created");
                
                  var query = "INSERT INTO temp (pointType,name,type,image,description, coor_long, coor_lat) VALUES (?,?,?,?,?,?,?)";
                
                  $cordovaSQLite.execute(db, query, [
                      "bug", 
                      "", 
                      "", 
                      "",
                      $scope.bugdesc, 
                      longi, 
                      lati])
                  .then(function(res) {
                      console.log("insertId: " + res.insertId);
                  }, function (err) {
                      console.error(err);
                  });
                
                  $scope.hide=false;
                  $cordovaToast.showLongBottom("Bug ajouté localement. Vous pourrez l'ajouter une fois que vous aurez du réseau").then(function(success) {}, function (error) {});
              }, function (err) {
                  console.log(err);
              });
          } else {
              $http.post('http://acrobatt-vm11.psi.ad.unistra.fr:3022/map/bug', {
                  properties:{
                      description:$scope.bugdesc
                  },
                  geometry:{
                      coordinates:[
                          longi
                          ,lati
                      ]
                  }
              })
              .success(function(data, status, headers, config) {
                  console.log("post point bug ok");
              })
              .error(function(data, status, headers, config) {
                  console.log("post point bug KO");
              }); 

              $scope.hide=false;
              $cordovaToast.showLongBottom("Bug ajouté.").then(function(success) {}, function (error) {});
          }
      }, function(err) {
          $scope.hide=false;
          $cordovaToast.showLongBottom("Problème de localisation, aucune coordonnées GPS n'as été trouvé.").then(function(success) {}, function (error) {});
      });
  }
})

.controller('tempCtrl', function($scope, $http, $cordovaSQLite, $cordovaNetwork, $cordovaToast, $cordovaFileTransfer, $cordovaFile, $q) {
  $scope.initTemp = function () {
      var db = $cordovaSQLite.openDB("temp_data_appli_POI");

      var query = "CREATE TABLE IF NOT EXISTS temp (id INTEGER PRIMARY KEY ASC, pointType TEXT, name TEXT, type TEXT, image TEXT, description TEXT, coor_long TEXT, coor_lat TEXT)";
      $cordovaSQLite.execute(db, query)
      .then(function(res) {
          console.log("table created");
      }, function (err) {
          console.log(err);
      });

      /*var query = "INSERT INTO temp (pointType,name,type,image,description, coor_long, coor_lat) VALUES (?,?,?,?,?,?,?)";

      $cordovaSQLite.execute(db, query, [
          "bug", 
          "", 
          "", 
          "",
          "test", 
          "10", 
          "10"])
      .then(function(res) {
          console.log("insertId: " + res.insertId);
      }, function (err) {
          console.log(err);
      });*/

      var query = "SELECT * FROM temp";

      $cordovaSQLite.execute(db, query).then(function(res) {
          var pointArru = new Array();
          if (res.rows.length != 0) {
              for (var i = 0; i < res.rows.length; i++) {
                  pointArru.push(res.rows.item(i));
              }
          } else {
              pointArru = "empty";
          }

          $scope.pointArray=pointArru;
      }, function (err) {
          console.log(err);
      });
  }

  $scope.initTemp();

  $scope.activeTonReseau = function () {
      return $cordovaNetwork.isOffline();
  }

  $scope.addAllTemp = function() {
      var res = 0;
      var db = $cordovaSQLite.openDB("temp_data_appli_POI");

      var query = "SELECT * FROM temp";

      $cordovaSQLite.execute(db, query).then(function(res) {
          var tabTemp = [];
          for (var i = 0; i < res.rows.length; i++) {
              tabTemp.push(res.rows.item(i));
          }
          console.log(tabTemp);

          if (res.rows.length != 0) {
              for (var u = 0; u < res.rows.length; u++) {
                  if (tabTemp[u]["pointType"]=="bug") {
                      $http.post('http://acrobatt-vm11.psi.ad.unistra.fr:3022/map/bug', {
                          properties:{
                              description:tabTemp[u]["description"]
                          },
                          geometry:{
                              coordinates:[
                                  tabTemp[u]["coor_long"]
                                  ,tabTemp[u]["coor_lat"]
                              ]
                          }
                      })
                      .success(function(data, status, headers, config) {
                          console.log("bug add");
                      })
                      .error(function(data, status, headers, config) {
                          console.log("pb database");
                      });

                      console.log(u);
                  }

                  else if (tabTemp[u]["pointType"]=="POI") {
                      var buildParams = function() {
                          return $q.when({
                              index: u,
                              fileTransferOptions: {
                                  url: "http://acrobatt-vm11.psi.ad.unistra.fr:3022/map/media",
                                  targetPath: tabTemp[u]["image"],
                                  trustHosts: true,
                                  options: {
                                      params:{
                                          name:tabTemp[u]["name"],
                                          description:tabTemp[u]["description"],
                                      }
                                  }
                              }
                          });
                      };

                      buildParams().then(function(params) {
                          return $q.all([
                              params,
                              $cordovaFileTransfer.upload(
                                  params.fileTransferOptions.url, 
                                  params.fileTransferOptions.targetPath, 
                                  params.fileTransferOptions.options, 
                                  params.fileTransferOptions.trustHosts
                              )
                          ]);
                      })
                      .then(function(results) {
                          var params = results[0];
                          var fileTransferResult = results[1];

                          var response = JSON.parse(fileTransferResult.response);

                          var idMedia = response.value._id;
                          var name = response.value.name;
                          var desc = response.value.description;

                          $http.post('http://acrobatt-vm11.psi.ad.unistra.fr:3022/map/poi', {
                              properties:{
                                  name:name
                                  ,type:"55686b2933d5a49a4b9bdb94"
                                  ,medias:[idMedia]
                                  ,description:desc
                              },
                              geometry:{
                                  coordinates:[
                                      tabTemp[params.index]["coor_long"]
                                      ,tabTemp[params.index]["coor_lat"]
                                  ]
                              }
                          }).success(function(data, status, headers, config) {
                              $cordovaToast.showLongBottom("POI ajouté.").then(function(success) {
                                  // message
                              }, function (error) {
                                  // error
                              });
                          })
                          .error(function(data, status, headers, config) {
                              $cordovaToast.showLongBottom("Ajout du POI échoué.").then(function(success) {
                                  // message
                              }, function (error) {
                                  // error
                              });
                          });
                      });
                  }

                  var query = "DELETE FROM temp WHERE id="+tabTemp[u]["id"];

                  $cordovaSQLite.execute(db, query).then(function(res) {
                      console.log("suppress done pour id : "+res);
                  }, function (err) {
                      console.log(err);
                  });
              }
          }

          $scope.pointArray = "empty";
          $cordovaToast.showLongBottom("Tous les points en attentes ont été ajouté.").then(function(success) {}, function (error) {});
      }, function (err) {
          console.log(err);
      });
  }  
})

.controller('settingsCtrl', function($scope, $cordovaSQLite, $ionicSideMenuDelegate, $cordovaToast) {  
  $scope.initRangeSlider = function () {    
    var db = $cordovaSQLite.openDB("temp_data_appli_POI");
    
    /*var deleteTable = "DROP TABLE tempOptions";
    $cordovaSQLite.execute(db, deleteTable)
    .then(function(res) {
      console.log("table delete");
    }, errorFunction);*/
    
    var queryCreateTable = "CREATE TABLE IF NOT EXISTS tempOptions (id INTEGER PRIMARY KEY ASC, key TEXT, value TEXT)";
    $cordovaSQLite.execute(db, queryCreateTable)
    .then(function(res) {
     
      var selectRadius = "SELECT key, value FROM tempOptions where key = 'radius'";
      $cordovaSQLite.execute(db, selectRadius)
      .then(function(res) {
        if(res.rows.length == 0) {
          
          var queryInsertRadius = "INSERT INTO tempOptions (key, value) VALUES ('radius', '30')";
          $cordovaSQLite.execute(db, queryInsertRadius)
          .then(function(res) {
            console.log("radius initialize at 30");
            $scope.options.radius = 30;
          }, errorFunction);
        } else {      
         $scope.options = {'radius' : res.rows.item(0).value};
          console.log("récupération du radius");
        }
      }, errorFunction);
    }, errorFunction);
  }
  
  $scope.initRangeSlider();
  
  var errorFunction = function (err) {
    console.log(err);
  }

  $scope.saveParameters = function () {        
    var db = $cordovaSQLite.openDB("temp_data_appli_POI");
      
    console.log($scope.options.radius);
    var queryUpdateRadius = "UPDATE tempOptions SET value = "+$scope.options.radius+" WHERE key = 'radius'";
    $cordovaSQLite.execute(db, queryUpdateRadius)
    .then(function(res) {
      $cordovaToast.showLongBottom("Paramètres mit à jour !").then(function(success) {}, function (error) {});
      $scope.options.radius = $scope.options.radius;
    }, errorFunction);
  }
});