angular.module('starter.controllers', ['ui.bootstrap','ionic','jett.ionic.filter.bar','ngStorage'])

  .controller('FriendUsernameCtrl',  function($scope,$location, Resources,$sessionStorage,$state){
    $scope.closeModal = function(){
      $state.go("tab.friend", {}, {reload: false});
    };
    $scope.list_position = [];
    // Carte pour chaque friend
    var parametre= $location.url().split('/');
    $scope.username = parametre[3];
    // Option pour la carte
    var mapOptions = {
      center: new google.maps.LatLng(44.8066376, -0.6073554),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false,
      zoom: 15,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: true
    };
    //Creation de la carte
    var map = new google.maps.Map(document.getElementById("map2"), mapOptions);

    Resources.user.get({
      username: $scope.username,
      token: $sessionStorage.token
    }).$promise.then(function (positions, Resource) {
      if (!positions.ghostMode) {
        if (positions.positions != undefined && positions.positions.length > 1){
          map.setCenter({lat : positions.positions[0].lat, lng : positions.positions[0].lng});
          var date = new Date(positions.positions[0].date);
          var date2 = new Date(positions.positions[positions.positions.length -1].date);
          $scope.date1 = date.toLocaleTimeString("fr-FR") + ' ' + date.toLocaleDateString("fr-FR");
          $scope.date2 = date2.toLocaleTimeString("fr-FR") + ' ' + date2.toLocaleDateString("fr-FR");

          var distance, date_pos;
          angular.forEach(positions, function (value, key) {
            console.log(value);
            distance = calcul_distance(value,$sessionStorage.current_position);
            date_pos = new Date(positions[key].date);
            date_pos = date_pos.toLocaleTimeString("fr-FR") + ' ' + date_pos.toLocaleDateString("fr-FR");
            if(parseFloat(distance) > 2000)
              distance = distance/1000 + ' km';
            else
              distance = distance + ' m';
            console.log("salut");
            $scope.list_position.push({distance : distance, date : date_pos});
            console.log("non");
          });

          /*
          var flightPath = new google.maps.Polyline({
            path: positions,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
          });
          flightPath.setMap(map);
*/
        }
    }
    });
  })


  .controller('LoginCtrl',  function($scope,$state, $ionicFilterBar,LoginService, Resources,$ionicPopup,$sessionStorage) {
    $scope.$on('$ionicView.beforeEnter', function(){
      $scope.loginData = {};

      $scope.login = function() {
        LoginService.loginUser($scope.loginData.username, $scope.loginData.password).success(function(loginData) {
          $scope.user=Resources.user.get({username: $scope.loginData.username, token: $sessionStorage.token}, function(user) {
            // everything went fine
            $sessionStorage.active = true;
            $sessionStorage.enable = $scope.user.enable;
            $sessionStorage.ghostMode = $scope.user.ghostMode;
            $sessionStorage.username = $scope.user.username;
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


  .controller('SignUpCtrl',  function($scope,$state, $ionicFilterBar,SignUpService, Resources,$ionicPopup,$sessionStorage) {
    $scope.$on('$ionicView.beforeEnter', function(){
      $scope.signUpData = {};

      $scope.signUp = function() {
        if (bonmail($scope.signUpData.email) && samePasswords($scope.signUpData.password,$scope.signUpData.password2) && bonpassword($scope.signUpData.password)) {
          SignUpService.signUpUser($scope.signUpData.username, $scope.signUpData.email, $scope.signUpData.password).success(function(loginData){
            $scope.user = Resources.user.get({username: $scope.signUpData.username, token: $sessionStorage.token}, function() {
              // everything went fine
              $sessionStorage.active = true;
              sessionStorage.enable = true;
              $sessionStorage.ghostMode = false;
              $sessionStorage.username = $scope.signUpData.username;
              $sessionStorage.email = $scope.user.email;
              $state.go("tab.home", {}, {reload: true})
            })
          }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
              title: 'Sign Up failed!',
              template: 'Your username already exist.. Please try an other.'
            });
          });
        }
        else if(!bonmail($scope.signUpData.email)){
          var alertPopup = $ionicPopup.alert({
            title: 'Sign Up failed!',
            template: 'Your email is incorrect.. Please try again.'
          });
        }
        else if(!samePasswords($scope.signUpData.password, $scope.signUpData.password2)){
          var alertPopup = $ionicPopup.alert({
            title: 'Sign Up failed!',
            template: 'Passwords are different.. Please try again.'
          });
        }else if(!bonpassword($scope.signUpData.password)){
          var alertPopup = $ionicPopup.alert({
            title: 'Sign Up failed!',
            template: 'Password need minimum 6 characters.. Please try again.'
          });
        }

      }
    })
  })

  .controller('DashCtrl',  function($scope, $ionicFilterBar,LoginService, Resources,$ionicPopup,$sessionStorage,$state) {

    $scope.$on('$ionicView.beforeEnter', function(){
      $scope.sessionUsername = $sessionStorage.username;
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


  .controller('MapCtrl', function($scope,$ionicFilterBar,$sessionStorage,$ionicScrollDelegate,Resources, $window, $q) {
    $scope.sessionUsername = $sessionStorage.username;
    $scope.map_available = true;
    $scope.position = false;
    $scope.filtre_rayon = 1000;
    var Enseirb_position = new google.maps.LatLng(44.8066376, -0.6073554);
    var current_position = {lat : 44.8066376, lng : -0.6073554};

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

    //Creation de la carte
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //Creation des cercles
    var cercle_position = new google.maps.Circle({
      strokeColor: '#ff864b',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#ff9d82',
      fillOpacity: 0.10,
      map: map,
      center: map.center,
      radius: $scope.filtre_rayon
    });
    var estimation_postition = new google.maps.Circle({
      strokeColor: '#a3afff',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#86f3ff',
      fillOpacity: 0.10,
      map: map,
      center: map.center,
      radius: $scope.filtre_rayon
    });

    //Fonction qui permet de changer le rayon lorsqu'on l'augmente / diminue
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
    };

    $scope.centre_marquer = function(info_bulle,marker){
      $ionicScrollDelegate.scrollTop();
      map.setCenter(marker.position);
      map.setZoom(16);
      info_bulle.open(map, marker);
    };

    // --- ALLER CHERCHER LA LISTE D AMI SUR LE SERVER ---------------

    var list_friend=[];
    var friends = null;
    var friend_position = null;
    Resources.friends.query({username: $scope.sessionUsername, token: $sessionStorage.token}).$promise.then(function(friends, Resource) {
      var friend_position;
      var promiseHash = [];
      friends.forEach(function(friend){
        promiseHash.push(Resources.user.get({username: friend.username, token: $sessionStorage.token}).$promise.then(function(friend_position, Resource) {
          if (!friend_position.ghostMode) {
            var date = new Date(friend_position.positions[friend_position.positions.length -1].date);
            date = date.toLocaleTimeString("fr-FR") + ' ' + date.toLocaleDateString("fr-FR");
            list_friend.push({name: friend.username,
              lat: friend_position.positions[friend_position.positions.length-1].lat,
              lng:friend_position.positions[friend_position.positions.length-1].lng,
              date : date,
              info_bulle : new google.maps.InfoWindow()});
          }

        }).catch(function(err){
          throw err; // rethrow;
        }));
      });
      $q.all(promiseHash).then(function(){
        // -------------------- CREATION DU MARKER CLUSTER -----------------------------------------------------------------
        markers = list_friend.map(function(data,i) {
            list_friend[i].info_bulle = new google.maps.InfoWindow();
            list_friend[i].info_bulle.setContent('<h3><a href="#/tab/friend/' + data.name + '">' + data.name + '</a></h3>Distance : Non connue');
            list_friend[i].marker = addMarker(map,data,data.info_bulle);
            return list_friend[i].marker
        });
        markerCluster = new MarkerClusterer(map, markers,
          {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
      });
    }).catch(function(err){
      throw err; // rethrow;
    });


    // -----------------   Ajouter un marker personnalisé pour la position ---------------------------------------------
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
    // -----------------------------------------------------------------------------------------------------------------


    function goto_direction(){
      map.setCenter({lat : current_position.lat, lng : current_position.lng});
    }
    // ------------------ AJOUT DES CONTROLES / LEGENDES SUR LA CARTE --------------------------------------------------
    var legend = document.createElement('div');
    var centerControl2 = new CreateControl(legend, map,
      '<div style="color : #ff9d82;"><strong>-</strong> Filtre</div><div style="color : #a3afff;"><strong>-</strong> Approximation</div>');
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);

    var centerControlDiv = document.createElement('div');
    var centerControl = new CreateControl(centerControlDiv, map, '<img src="../img/icon_centre.ico" width="20px" height="20px"></img>');
    centerControlDiv.addEventListener('click', function(){
      goto_direction();
    });
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);

    // Localisation du telephone
    var first_time = true;
    var survId = navigator.geolocation.watchPosition(function (pos) {
      //sauvegarde dans la base de donnée
      $scope.position  = true;
      current_position.lat = pos.coords.latitude;
      current_position.lng = pos.coords.longitude;
      current_position.time = pos.timestamp;

      if(first_time == true){
        first_time = false;
        map.setCenter(current_position);
      }

      //Mise à jour de la map
      cercle_position.setCenter(current_position);
      estimation_postition.setCenter(current_position);
      estimation_postition.setRadius(pos.coords.accuracy);
      myLocation.setPosition(current_position);

      if (list_friend[0] != undefined) {
        var distance;

        // On ajoute les distances avec les différents amis
        angular.forEach(list_friend, function (value, key) {
          list_friend[key].distance = calcul_distance(value,current_position);
          if(parseFloat(list_friend[key].distance) > 2000)
            distance = list_friend[key].distance/1000 + ' km';
          else
            distance = list_friend[key].distance + ' m';
          list_friend[key].info_bulle.setContent('<h3><a href="#/tab/friend/' + list_friend[key].name + '">' + list_friend[key].name + '</a></h3>Distance : ' + distance);
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


  .controller('FriendCtrl', function($rootScope, $scope, $interval, $state, Resources,$ionicFilterBar,$sessionStorage,$ionicModal) {
    var _selected;
    $scope.selected = undefined;
    $scope.requete_friend = function(name){
      var friends_name = [];
      return Resources.listUsername.query({username: name, token: $sessionStorage.token}).$promise.then(function(friends, Resource) {
        friends.forEach(function(friend){
          friends_name.push(friend.username);
        });
        return friends_name;
      });
    };

    // saisie du nom de la carte
    $scope.friend_request = null;
    $scope.showFilterBar = function () {
      var filterBarInstance = $ionicFilterBar.show({
        cancelText: "Cancel", //"<i class='ion-ios-close-outline'></i>",
        items: $scope.friends,
        update: function (filteredItems, filterText) {
          $scope.friends = filteredItems;
        }
      });
    };

    // the interval must be cancelled on destroy
    $scope.$on('$destroy', function() {
      $interval.cancel(refresh);
    });

    $scope.$on('$ionicView.beforeEnter', function(){
      $scope.sessionUsername = $sessionStorage.username;

      $scope.sessionEmail = $sessionStorage.email;
      $scope.activeItem = {};

      $scope.username = $sessionStorage.username;
      $scope.futureFriend = {};
      $scope.friends = Resources.friends.query({username: $scope.username, token: $sessionStorage.token});
      $scope.friendsRequest = Resources.friendsRequest.query({username: $scope.username, token: $sessionStorage.token});
      // refresh view every 30s
      refresh = $interval(function() {
        var newFriends = Resources.friends.query({username: $scope.username, token: $sessionStorage.token}, function() {
          if ( !angular.equals($scope.friends, newFriends) ) {
            // update view on change
            $scope.friends = newFriends;
          }
        });
        var newFriendsRequest = Resources.friendsRequest.query({username: $scope.username, token: $sessionStorage.token}, function() {
          if ( !angular.equals($scope.friendsRequest, newFriendsRequest) ) {
            // update view on change
            $scope.friendsRequest  = newFriendsRequest;
          }
        });
      }, 10000);

      $scope.acceptRequest = function(friendUsername) {
        Resources.friends.save({username: $scope.username,token: $sessionStorage.token}, {username: friendUsername}, function(){
          $state.go("tab.friend", {}, {reload: true});
        });
      };

      $scope.declineRequest = function(friendUsername) {
        Resources.friendsRequestUser.remove({username: $scope.username, friendusername: friendUsername, token: $sessionStorage.token}, function() {
          $state.go("tab.friend", {}, {reload: true});
        }, function () {
          // damn
        });
      };

      $scope.addRequest = function() {
        // POST request in the future friend database
        Resources.friendsRequest.save({username: $scope.username, token: $sessionStorage.token}, {username: $scope.futureFriend.username},
          function () {
            // everything went fine
            $scope.futureFriend.requestSend = true;
            $state.go("tab.friend", {}, {reload: true});
          },
          function () {
            // a problem happened
            $scope.futureFriend.requestSend = false;
            $state.go("tab.friend", {}, {reload: true});
          }
        );
      };

      $scope.deleteFriend = function(friendUsername) {
        Resources.friend.remove({username: $scope.username, friend: friendUsername, token: $sessionStorage.token}, function(){
          $state.go("tab.friend", {}, {reload: true})
        });

      };
    });
  })

  .controller('AccountCtrl', function($scope,$sessionStorage,$state,$window,PasswordService, $ionicPopup, Resources) {

    $scope.$on('$ionicView.beforeEnter', function(){
      $scope.settings = {
        enableFriendsLocalisation: $sessionStorage.enable,
        modeFantome: $sessionStorage.ghostMode
      };
      $scope.enablePosition= function(){
        $sessionStorage.enable = $scope.settings.enableFriendsLocalisation
        Resources.user.update({username: $sessionStorage.username, token: $sessionStorage.token},{enable: $sessionStorage.enable}, function(){
        });
      }
      $scope.modeFantome= function(){
        $sessionStorage.ghostMode = $scope.settings.modeFantome;
        Resources.user.update({username: $sessionStorage.username, token: $sessionStorage.token},{ghostMode: $sessionStorage.ghostMode}, function(){});
      }
      $scope.sessionEmail = $sessionStorage.email;
      $scope.sessionUsername = $sessionStorage.username;


      $scope.logout = function() {
        disconnect($sessionStorage,$window);
      };
      $scope.Data = {};
      $scope.password = function(){

        if (bonpassword($scope.Data.password) && samePasswords($scope.Data.password, $scope.Data.password2)) {
          PasswordService.changePassword($scope.sessionUsername,$scope.Data.actualPassword,$scope.Data.password).success(function() {
            var alertPopup = $ionicPopup.alert({
              title: 'Password changed !',
              template: 'You just change your password.'
            });
          }).error(function() {
            var alertPopup = $ionicPopup.alert({
              title: 'Password change failed !',
              template: 'Actual password is wrong'
            });
          });
        }
        else if(!samePasswords($scope.Data.password, $scope.Data.password2)){
          var alertPopup = $ionicPopup.alert({
            title: 'Password change failed!',
            template: 'Passwords are different.. Please try again.'
          });
        }else if(!bonpassword($scope.Data.password)){
          var alertPopup = $ionicPopup.alert({
            title: 'Password change failed!',
            template: 'Password need minimum 6 characters.. Please try again.'
          });
        }
      }
    });
  })
  .controller('TabsCtrl', function($scope, $sessionStorage, Resources) {

    $scope.session=false;
    $scope.$on('$ionicView.beforeEnter', function(){
      if ($sessionStorage.active == null) {
        $scope.session = false;
      }
      else {
        $scope.session = true;
      }
    });
  });
// Adds a marker to the map.
function addMarker(map,info_friend,info_bulle){
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(info_friend.lat, info_friend.lng),
    label: "" + info_friend.name,
    map: map,
    title : "Location of " + info_friend.name
  });

  marker.addListener('click', function() {
    info_bulle.open(map, marker);
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

function CreateControl(controlDiv, map,text){

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  //controlUI.style.textAlign = 'center';
  controlUI.style.marginRight = '10px';
  controlUI.title = 'Click to recenter the map';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = text;
  controlUI.appendChild(controlText);
}


function bonmail(mailteste)

{
  var reg = new RegExp('^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$', 'i');

  return(reg.test(mailteste));
}

function samePasswords(pw, pw2){
  return pw==pw2;
}

function bonpassword(pw){
  return pw.length > 5;
}
function disconnect($sessionStorage,$window){
  $sessionStorage.$reset();
  $window.location.reload(true);
}
