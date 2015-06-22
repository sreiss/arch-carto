angular.module('gpstrail.controllers', ['ionic', /*'ionic-material',*/ 'ngCordova'])

.controller('containerCtrl', function ($scope) {
  
})

.controller('initCtrl', function ($scope, $state, $cordovaFile) {
  $scope.fileChanged = function (element) {
    var file = element.files[0];
    var reader = new FileReader();
    var fileTmpName = 'tempGpx.gpx';
    var ngCordovaDir = cordova.file.externalDataDirectory;
    var gpxDir = "gpxs";
      
    reader.onload = function() {  
      $cordovaFile.checkDir(ngCordovaDir, gpxDir)
      .then(function(directory) {
        console.log("Directory still existing");
        $cordovaFile.writeFile(ngCordovaDir + directory.name, fileTmpName, file, true).then(writeFileSuccess, errFunction);
      }, function(errorDirNotExist) {
        console.log("Directory not existing");
        $cordovaFile.createDir(ngCordovaDir, gpxDir, false)
        .then(function(directory) {
         console.log("Create directory");
          $cordovaFile.writeFile(ngCordovaDir + directory.name, fileTmpName, file, true).then(writeFileSuccess, errFunction);
        }, errFunction);
      });
    };

    reader.readAsDataURL(file);
    
    function writeFileSuccess(file) {
      console.log("Writing file");
      $state.go('gpstrail.guidage', {
        'ngCordovaDir' : ngCordovaDir,
        'fileName' : fileTmpName,
        'gpxDir' : gpxDir
      });
    }
    
    function errFunction(error) {
      console.log(error);
    }
  };
})

.controller('guidageCtrl', function($scope, $cordovaGeolocation, $cordovaDeviceOrientation, $stateParams, $cordovaFile, $cordovaToast, $cordovaFileOpener2) 
{
  // All scopes variables
  var isCheck = false;
  $scope.checkIsChecked = function(checkcheck) {
    isCheck = checkcheck;
    if (isCheck == true) {    // no focus on position, you're able to explore the map
      $cordovaToast.showShortBottom('Navigation libre activée').then(function(success) {}, function (error) {});  
    } else {                  // focus on position, not able to explore map
      $cordovaToast.showShortBottom('Navigation libre désactivée').then(function(success) {}, function (error) {});           
    }
  }
  
  /*var readGpxFile = function(gpxFileName)
  {
    
  }*/
  
  $scope.initMap = function() {
    // GPX File variables
    var ngCordovaDir = $stateParams.ngCordovaDir;
    var gpxDir = $stateParams.gpxDir;
    var gpxFile = $stateParams.fileName;
    //var fullGpxPath = ngCordovaDir + gpxDir + "/" + gpxFile;
    var fullGpxPath = "test4.gpx";
    var gpxOnMap  = "";
    
    // Geolocalisation variables
    var lati = 0;
    var longi = 0;
    
    // Map variables
    var map = L.map('map');
    var petitBonhomme = L.icon({
      iconUrl: 'img/running_man.png',
      iconSize:     [30, 30], // size of the icon
      iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    var marker = "";
    
    // Watcher options and variables initialization
    var positionWatcher = "";
    var positionWatchOptions = {
      frequency : 1000,
      timeout : 3000,
      enableHighAccuracy: true // may cause errors if true
    };
    
    var initPosOptions = {
      timeout: 10000, 
      enableHighAccuracy: true
    };
    
    var compassWatcher = "";
    var compassWatchOptions = {
      frequency: 3000,
      filter: true     // if frequency is set, filter is ignored
    }
    
    // V 2.0
    /*$cordovaFile.checkFile(ngCordovaDir + gpxDir + "/", gpxFile).then(function (gpxFile) 
    {  
      var rawFile = new XMLHttpRequest();
      rawFile.open("GET", gpxFile.nativeURL, false);
      rawFile.onreadystatechange = function ()
      {
          if(rawFile.readyState === 4)
          {
              if(rawFile.status === 200 || rawFile.status == 0)
              {
                var dom = (new DOMParser()).parseFromString(rawFile.responseText, 'text/xml');
                 var gpx = toGeoJSON.gpx(dom);
                
                
                console.log('gpxContent : ' + rawFile.responseText);
                console.log(gpx);
              }
          }
      }
    
    rawFile.send(null);
      
      
      var gpx = toGeoJSON.gpx(domFile);

      console.log(gpx.features.geometry.coordinates[2]);
      debugger;
    },
   function (error) 
   {
      console.log(fullGpxPath);
      console.log(error);
    });  */
    
    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
      maxZoom: 20,
      zoom: 20,
      id: 'examples.map-i875mjb7'
    }).addTo(map);
    
    // Check if GPXfile exist, else => internal error => code error
    $cordovaFile.checkFile(ngCordovaDir + gpxDir + "/", gpxFile)
    .then(function (gpxFile) {        
      var gpxOnMap = new L.GPX(fullGpxPath, {async: true}).on('loaded', function(e) {
        map.fitBounds(e.target.getBounds());
      }).addTo(map);
      
      // Init you're position on the map and set marker
      $cordovaGeolocation.getCurrentPosition(initPosOptions).then(
      function (position) {
        lati  = position.coords.latitude;
        longi = position.coords.longitude;

        marker = L.marker([lati, longi], {icon: petitBonhomme}).addTo(map);

        // Begin position watching
        positionWatcher = $cordovaGeolocation.watchPosition(positionWatchOptions);
        positionWatcher.then(
          null,
          function(err) {
            alert("Erreur de geolocation !");
          },
          function(position) {
            lati  = position.coords.latitude;
            longi = position.coords.longitude;

            $scope.latit = lati;  
            $scope.longit = longi;

            marker.setLatLng([lati, longi]).update();

            if (isCheck == true) {    // no focus on position, you're able to explore the map
              //if de sécurité
            } else {                  // focus on position, not able to explore map
              map.setView([lati, longi], 20);           
            }
        });
      }, function(err) {
        alert("Erreur de geolocalisation !");
      });
      
      
    }, function (error) {
      console.log(fullGpxPath);
      console.log(error);
    });
    
    setInterval(function() {
      $cordovaDeviceOrientation.getCurrentHeading().then(function(result) {
        $scope.angle = result.magneticHeading;
        console.log('init biatch angle'+result.magneticHeading);
      }, function(err) {
        alert("Erreur init de rotation !");
      }
      )}, 2000);
    };
});


