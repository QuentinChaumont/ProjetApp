
angular.module('starter.controllers', ['ionic','jett.ionic.filter.bar','ngStorage'])

  .controller('LoginCtrl',  function($scope,$state, $ionicFilterBar,LoginService, Resources,$ionicPopup,$sessionStorage,$state) {
    $scope.$on('$ionicView.beforeEnter', function(){
      $scope.loginData = {};

      $scope.login = function() {
        LoginService.loginUser($scope.loginData.username, $scope.loginData.password).success(function(loginData) {
           $scope.user = Resources.user.get({username: $scope.loginData.username}, function() {
            // everything went fine
            console.log("login");
             $sessionStorage.active = true;
             $sessionStorage.username = $scope.loginData.username;
             $sessionStorage.email = $scope.user.email;
             $state.go("tab.home", {}, {reload: true})
           })
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
      }
    })
  })


  .controller('SignUpCtrl',  function($scope,$state, $ionicFilterBar,SignUpService, Resources,$ionicPopup,$sessionStorage,$state) {
    $scope.$on('$ionicView.beforeEnter', function(){
      $scope.signUpData = {};

      $scope.signUp = function() {
        SignUpService.signUpUser($scope.signUpData.username,$scope.signUpData.username, $scope.signUpData.password).success(function(loginData) {
           $scope.user = Resources.user.get({username: $scope.signUpData.username}, function() {
            // everything went fine
              console.log("signUp");
             $sessionStorage.active = true;
             $sessionStorage.username = $scope.signUpData.username;
             $sessionStorage.email = $scope.user.email;
             $state.go("tab.home", {}, {reload: true})
           })
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
      }
    })
  })

  .controller('DashCtrl',  function($scope,$state, $ionicFilterBar,LoginService, Resources,$ionicPopup,$sessionStorage,$state) {

    $scope.$on('$ionicView.beforeEnter', function(){

      $scope.sessionUsername = $sessionStorage.username;
      $scope.sessionEmail = $sessionStorage.email;
        if ($sessionStorage.active == null) {
          $scope.session = false;

        }
        else {
          $scope.session = true;
        }

        $scope.login = function() {
          $state.go("tab.login", {}, {reload: true});
        }
        $scope.signUp = function() {
          $state.go("tab.signUp", {}, {reload: true});
        }

      })
  })

  .controller('MapCtrl', function($scope,$ionicFilterBar, $ionicLoading, $location, $anchorScroll, Resources) {
    $scope.map_available = true;
    $scope.position = false;
    $scope.filtre_rayon = 50;

    var Enseirb_position = new google.maps.LatLng(44.8066376, -0.6073554);
    var current_position = {lat : 44.8066376, lng : -0.6073554};
    var cercle_position,estimation_postition;



    // Option pour la carte
    var mapOptions = {
      center: Enseirb_position,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false,
      zoom: 15,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: true
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    cercle_position = new google.maps.Circle({
      strokeColor: '#ff864b',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#ff9d82',
      fillOpacity: 0.10,
      map: map,
      center: map.center,
      radius: $scope.filtre_rayon
    });
    estimation_postition = new google.maps.Circle({
      strokeColor: '#a3afff',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#86f3ff',
      fillOpacity: 0.10,
      map: map,
      center: map.center,
      radius: $scope.filtre_rayon
    });

    $scope.change = function(filtre_rayon){
      var valeur_rayon = parseFloat(filtre_rayon);
      if (valeur_rayon <= 2000)
        cercle_position.setRadius(valeur_rayon);
      else
        cercle_position.setRadius(0);
      if (valeur_rayon < 75)
        map.setZoom(18);
      else if (valeur_rayon >= 75 && valeur_rayon < 150)
        map.setZoom(17);
      else if (valeur_rayon >= 150 && valeur_rayon < 300)
        map.setZoom(16);
      else if (valeur_rayon >= 300 && valeur_rayon < 500)
        map.setZoom(15);
      else if(valeur_rayon >= 500 && valeur_rayon < 1000)
        map.setZoom(14);
      else if(valeur_rayon >= 1000 && valeur_rayon <= 2000)
        map.setZoom(13);
      else if(valeur_rayon > 2000)
        map.setZoom(12);

      //$scope.filtre_rayon = filtre_rayon;
      //$location.hash('selector_range');
      //$anchorScroll();
    };

    // --- ALLER CHERCHER LA LISTE D AMI SUR LE SERVER ---------------
    /*
    var friends = Resources.friends.query({username: $rootScope.username});
    var friend_position;
    var list_friend = [];
    var tmp_id = 1;
    for friend in list_friends {
      friend_position = Resource.friendsPosition({username: $rootScope.username},{friendusername: friend});
      list_friend.push({id: tmp_id, name: friend, lat: friend_position.x, lng: friend_position.x});
      tmp_id++;
    }
    */

    //Ajouter un marker
    var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

    var myLocation = new google.maps.Marker({
      position: Enseirb_position,
      map: map,
      icon: image,
      title: "My Location"
    });
    var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h5 id="firstHeading" class="firstHeading">My Location</h5>'+
      '<div id="bodyContent">'+
      '</div>'+
      '</div>';

    var fenetre = new google.maps.InfoWindow({
      content: contentString
    });
    myLocation.addListener('click', function() {
      fenetre.open(map, myLocation);
    });


    function CenterControl(controlDiv, map){

      // Set CSS for the control border.
      var controlUI = document.createElement('div');
      controlUI.style.backgroundColor = '#fff';
      controlUI.style.border = '2px solid #fff';
      controlUI.style.borderRadius = '3px';
      controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
      controlUI.style.cursor = 'pointer';
      controlUI.style.textAlign = 'center';
      controlUI.style.marginRight = '10px';
      controlUI.title = 'Click to recenter the map';
      controlDiv.appendChild(controlUI);

      // Set CSS for the control interior.
      var controlText = document.createElement('div');
      controlText.style.paddingLeft = '5px';
      controlText.style.paddingRight = '5px';
      controlText.innerHTML = '<img src="../img/icon_centre.ico" width="20px" height="20px"></img>';
      controlUI.appendChild(controlText);

      controlUI.addEventListener('click', function(){
        goto_direction();
      });
    }


    function goto_direction(){
      map.setCenter({lat : current_position.lat, lng : current_position.lng});
    }

    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    var legend = document.createElement('div');
    legend.innerHTML = '<h3>Legend</h3>';
    var centerControl2 = new CenterControl(legend, map);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);

    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);
    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);


    var list_friend = [
      {id: 1, name: "Thibaud", lat: 44.8076376, lng: -0.6073554,info_bulle : new google.maps.InfoWindow()},
      {id: 2, name: "Quentin", lat: 44.8086376, lng: -0.6073554,info_bulle : new google.maps.InfoWindow()},
      {id: 3, name: "Pad", lat: 44.8096376, lng: -0.6073554,info_bulle : new google.maps.InfoWindow()},
      {id: 4, name: "test", lat: 43.494555, lng: 4.979117,info_bulle : new google.maps.InfoWindow()},
      {id: 5, name : "test2", lat:43.50455, lng: 4.979117,info_bulle : new google.maps.InfoWindow()}
    ];

    markers = list_friend.map(function(data,i) {
      list_friend[i].info_bulle.setContent('<h3>' + data.name + '</h3>');
      return addMarker(map,data,data.info_bulle);
    });
    // Add a marker clusterto manage the markers.
    markerCluster = new MarkerClusterer(map, markers,
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

    // -----------------------------------------------------------------------
    // Permet de recuperer la géolocalisation
    var markers, markerCluster;

    /* ---------- PERMET DE FAIRE UNE DEMO ------------------------------------
    var compteur = 0;
    var intervalID = setInterval(function() { // On met en place l'intervalle pour afficher la progression du temps
      compteur = compteur + 1;
      current_position.lng = current_position.lng + compteur*0.01;
      myLocation.setPosition({lat : current_position.lat , lng : current_position.lng});
      // On ajoute les distances avec les différents utilisateur
      angular.forEach(list_friend, function (value, key) {
        list_friend[key].distance = calcul_distance({lat : value.lat, lng : value.lng},current_position);
        console.log(list_friend[key].distance);
        var distance;
        if(parseFloat(list_friend[key].distance) > 2000)
          distance = list_friend[key].distance/1000 + ' km';
        else
          distance = list_friend[key].distance + ' m';
        list_friend[key].info_bulle.setContent('<h3>' + list_friend[key].name + '</h3>Distance : ' + distance);
      });

      // On trie selon la distance
      list_friend.sort(function (a, b) {
        return a.distance - b.distance;
      });

      $scope.list_friend = list_friend;
      $scope.$apply();
    }, 5000);

    */

    var survId = navigator.geolocation.watchPosition(function (pos) {
      $scope.position  = true;
      current_position.lat = pos.coords.latitude;
      current_position.lng = pos.coords.longitude;

      cercle_position.setCenter({lat : current_position.lat , lng : current_position.lng});
      estimation_postition.setCenter({lat : current_position.lat , lng:current_position.lng});
      estimation_postition.setRadius(pos.coords.accuracy);
      myLocation.setPosition({lat : current_position.lat , lng : current_position.lng});

      var location, distance;
      if (list_friend[0] != undefined) {

        // On ajoute les distances avec les différents utilisateur
        angular.forEach(list_friend, function (value, key) {
          list_friend[key].distance = calcul_distance(value,current_position);
          var distance;
          if(parseFloat(list_friend[key].distance) > 2000)
            distance = list_friend[key].distance/1000 + ' km';
          else
            distance = list_friend[key].distance + ' m';
          list_friend[key].info_bulle.setContent('<h3>' + list_friend[key].name + '</h3>Distance : ' + distance);
        });

        // On trie selon la distance
        list_friend.sort(function (a, b) {
          return a.distance - b.distance;
        });

        $scope.list_friend = list_friend;
        $scope.$apply();
      }
    });


    //Permet d'arreter de se localiser
    //navigator.geolocation.clearWatch(survId);

  },{enableHighAccuracy:true, maximumAge:60000, timeout:10000})


  .controller('AccountCtrl', function($scope,$sessionStorage,$state,$window) {
    $scope.$on('$ionicView.beforeEnter', function(){

    $scope.sessionUsername = $sessionStorage.username;
    $scope.sessionEmail = $sessionStorage.email;

   $scope.logout = function() {
    console.log("logout");
    $sessionStorage.$reset();
    $window.location.reload(true)
   }
   });
 })

  .controller('FriendCtrl', function($scope, $sessionStorage, Resources) {
    //TODO passer $scope.username en variable globale
    $scope.$on('$ionicView.beforeEnter', function(){
      $scope.sessionUsername = $sessionStorage.username;
      $scope.sessionEmail = $sessionStorage.email;


      $scope.username = $sessionStorage.username;
      $scope.futureFriend = {};

      $scope.friends = Resources.friends.query({username: $scope.username});
      $scope.friendsRequest = Resources.friendsRequest.query({username: $scope.username});

      $scope.acceptRequest = function(friend) {
        Resources.friends.save({username: $scope.username}, friend);
      };

      $scope.declineRequest = function(friend) {
        //TODO à debug : ne marche pas, pourtant coté serveur ça fonctionne (tests réalisés sous swagger)
        Resources.friendsRequest.remove({username: $scope.username}, friend);
      };

      $scope.addRequest = function() {
        // POST request in the future friend database
        Resources.friendsRequest.save({username: $scope.username}, {username: $scope.futureFriend.username},
          function () {
            // everything went fine
            $scope.futureFriend.requestSend = true;
          },
          function () {
            // a problem happened
            $scope.futureFriend.requestSend = false;
          }
        );
      }
      $scope.deleteFriend = function(friendUsername) {
        Resources.friend.remove({username: $scope.username, friend: friendUsername});
      };
    });
  })
  //
  // .controller('FriendCtrl', function($rootScope, $scope, Resources) {
  //   $scope.futureFriend = {};
  //
  //   $rootScope.username = "hello";
  //
  //   $scope.friends = Resources.friends.query({username: $rootScope.username});
  //   $scope.friendsRequest = Resources.friendsRequest.query({username: $rootScope.username});
  //
  //   //TODO modifier cette fonction pour qu'elle soit accessible dans tous les controlleurs et updatable
  //   $scope.isConnected = function() {
  //     if ($rootScope.username != undefined) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   };
  //
  //   $scope.delete = function(friend) {
  //     Resources.friend.remove({username: $rootScope.username}, friend);
  //   };
  //
  //   $scope.acceptRequest = function(friend) {
  //     Resources.friends.save({username: $rootScope.username}, friend);
  //   };
  //
  //   $scope.declineRequest = function(friend) {
  //     //TODO à debug : ne marche pas, pourtant coté serveur ça fonctionne (tests réalisés sous swagger)
  //     Resources.friendsRequest.remove({username: $rootScope.username}, friend);
  //   };
  //
  //   $scope.addRequest = function() {
  //     // POST request in the future friend database
  //     Resources.friendsRequest.save({username: $scope.futureFriend.username}, {username: $rootScope.username},
  //       function () {
  //         // everything went fine
  //         $scope.futureFriend.requestSend = true;
  //       },
  //       function () {
  //         // a problem happened
  //         $scope.futureFriend.requestSend = false;
  //       }
  //     );
  //   }
  // })


    .controller('TabsCtrl', function($scope, $sessionStorage, Resources) {

      $scope.session=false;
      $scope.$on('$ionicView.beforeEnter', function(){
        $scope.session
      if ($sessionStorage.active == null) {
        $scope.session = false;
          console.log($sessionStorage.active, $scope.session);
      }
      else {
        $scope.session = true;
        console.log($sessionStorage.active, $scope.session);
      }
    })
    });
// Adds a marker to the map.
function addMarker(map,info_friend,info_bulle){
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(info_friend.lat, info_friend.lng),
    label: "" + info_friend.id,
    map: map,
    title : "Location of " + info_friend.name
  });

  marker.addListener('click', function() {

    fenetre.open(map, marker);
  });
  return marker;
}

function calcul_distance(pos1,pos2){
  var R = 6378137;
  var dLat = (pos1.lat-pos2.lat) * Math.PI / 180;
  var dLon = (pos1.lng-pos2.lng) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(pos1.lat * Math.PI / 180 ) * Math.cos(pos2.lat * Math.PI / 180 ) *
    Math.sin(dLon/2) * Math.sin(dLon/2);

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var distance = Math.round(R * c);
  return distance;
}
