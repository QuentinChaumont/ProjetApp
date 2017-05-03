angular.module('starter.controllers', ['ui.bootstrap','ionic','jett.ionic.filter.bar','ngStorage'])

  .controller('LoginCtrl',  function($scope,$state, $ionicFilterBar,LoginService, Resources,$ionicPopup,$sessionStorage) {
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


  .controller('SignUpCtrl',  function($scope,$state, $ionicFilterBar,SignUpService, Resources,$ionicPopup,$sessionStorage) {
    $scope.$on('$ionicView.beforeEnter', function(){
      $scope.signUpData = {};

      $scope.signUp = function() {
        var hash = CryptoJS.SHA1($scope.Data.password);
        console.log("password : ", $scope.Data.password, hash);
        if (bonmail($scope.signUpData.email) && samePasswords($scope.signUpData.password,$scope.signUpData.password2) && bonpassword($scope.signUpData.password)) {
          SignUpService.signUpUser($scope.signUpData.username,$scope.signUpData.email, $scope.signUpData.password).success(function(loginData) {
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

  .controller('MapCtrl', function($scope,$ionicFilterBar,$sessionStorage,$ionicScrollDelegate,Resources) {
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
      var list_friend=[]
      Resources.friends.query({username: $scope.sessionUsername}).$promise.then(function(friends, Resource) {
      var friend_position;
      friends.forEach(function(friend) {
        console.log(friend.username);
        Resources.friendPosition.query({username: $scope.sessionUsername, friendusername: friend.username}).$promise.then(function(friend_position, Resource) {
          //console.log(friend);
          list_friend.push({name: friend.username, lat: friend_position[0].lat, lng:friend_position[0].lng,info_bulle : new google.maps.InfoWindow()});
       })
      });
   });

console.log("liste : ", list_friend);

    // var list_friend = [
    //   {id: 1, name: "Thibaud", lat: 44.8076376, lng: -0.6073554,info_bulle : new google.maps.InfoWindow()},
    //   {id: 2, name: "Quentin", lat: 44.8086376, lng: -0.6073554,info_bulle : new google.maps.InfoWindow()},
    //   {id: 3, name: "Pad", lat: 44.8096376, lng: -0.6073554,info_bulle : new google.maps.InfoWindow()},
    //   {id: 4, name: "test", lat: 43.494555, lng: 4.979117,info_bulle : new google.maps.InfoWindow()},
    //   {id: 5, name : "test2", lat:43.50455, lng: 4.979117,info_bulle : new google.maps.InfoWindow()}
    // ];

    /* Faire un polygone
     var flightPlanCoordinates = [
     {lat: 44.8076376, lng: -0.6073554},
     {lat: 44.8086376, lng: -0.6073554},
     {lat: 44.8096376, lng: -0.6073554}
     ];
     var flightPath = new google.maps.Polyline({
     path: flightPlanCoordinates,
     geodesic: true,
     strokeColor: '#FF0000',
     strokeOpacity: 1.0,
     strokeWeight: 2
     });
     flightPath.setMap(map);
     */


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

    // ----------------------------------------------------------------------------------------------------------------

    // -------------------- CREATION DU MARKER CLUSTER -----------------------------------------------------------------

    markers = list_friend.map(function(data,i) {
      list_friend[i].info_bulle = new google.maps.InfoWindow();
      console.log("<<<<<<<<",list_friend[i].name);
      list_friend[i].info_bulle.setContent('<h3><a href="#/tab/friend/' + data.name + '">' + data.name + '</a></h3>Distance : Non connue');
      list_friend[i].marker = addMarker(map,data,data.info_bulle);
      return list_friend[i].marker
    });
    markerCluster = new MarkerClusterer(map, markers,
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

    // -----------------------------------------------------------------------
    /* ---------- PERMET DE FAIRE UNE DEMO ------------------------------------
     var compteur = 0;
     var intervalID = setInterval(function() { // On met en place l'intervalle pour afficher la progression du temps
     compteur = compteur + 1;
     current_position.lng = current_position.lng + compteur*0.005;
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

    // Localisation du telephone
    var survId = navigator.geolocation.watchPosition(function (pos) {
      //sauvegarde dans la base de donnée
      var test = Resources.userPosition.save({username: $scope.sessionUsername},{lat: pos.coords.latitude, lng: pos.coords.longitude});
      $scope.position  = true;
      current_position.lat = pos.coords.latitude;
      current_position.lng = pos.coords.longitude;
      current_position.time = pos.timestamp

      //Mise à jour de la map
      cercle_position.setCenter({lat : current_position.lat , lng : current_position.lng});
      estimation_postition.setCenter({lat : current_position.lat , lng:current_position.lng});
      estimation_postition.setRadius(pos.coords.accuracy);
      myLocation.setPosition({lat : current_position.lat , lng : current_position.lng});

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

  .controller('ChatsCtrl', function($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('FriendCtrl', function($rootScope, $scope, Resources,$ionicFilterBar,$sessionStorage) {
    var _selected;

    $scope.selected = undefined;
    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

    // saisie du nom de la carte
    $scope.friend_request = null;
    $scope.search = "udazudzauid";
    $scope.places = [{name: 'New York'}, {name: 'London'}, {name: 'Milan'}, {name: 'Paris'}];

    $scope.showFilterBar = function () {
      var filterBarInstance = $ionicFilterBar.show({
        cancelText: "Cancel", //"<i class='ion-ios-close-outline'></i>",
        items: $scope.places,
        update: function (filteredItems, filterText) {
          $scope.places = filteredItems;
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

      $scope.friends = Resources.friends.query({username: $scope.username});
      $scope.friendsRequest = Resources.friendsRequest.query({username: $scope.username});

      // refresh list every 30s
      refresh = $interval(function() {
        var newFriends = Resources.friends.query({username: $scope.username});
        var newFriendsRequest = Resources.friendsRequest.query({username: $scope.username});
        // only update if necessary
        if ( !angular.equal($scope.friends, newFriends) ) {
          $scope.friends = newFriends;
        }
        if ( !angular.equal($scope.friendsRequest, newFriendsRequest) ) {
          $scope.friendsRequest  = newFriendsRequest;
        }
      }, 30000);

      $scope.acceptRequest = function(friendUsername) {
        Resources.friendsRequest.save({username: $scope.username, username: friendUsername}, function(){
          $state.go("tab.friend", {}, {reload: true});
        });
      };

      $scope.declineRequest = function(friendUsername) {
        Resources.friendsRequest.remove({username: $scope.username, username: friendUsername}, function(){
          $state.go("tab.friend", {}, {reload: true});
        });
      };

      $scope.addRequest = function() {
        // POST request in the future friend database
        Resources.friendsRequest.save({username: $scope.username}, {username: $scope.futureFriend.username},
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
        console.log(friendUsername, $scope.username);
        Resources.friend.remove({username: $scope.username, friend: friendUsername}, function(){
          $state.go("tab.friend", {}, {reload: true})
        });

      };
    });
  })

  .controller('AccountCtrl', function($scope,$sessionStorage,$state,$window,PasswordService, $ionicPopup) {
    $scope.$on('$ionicView.beforeEnter', function(){
      $scope.sessionEmail = $sessionStorage.email;
      $scope.sessionUsername = $sessionStorage.username;
      $scope.logout = function() {
        console.log("logout");
        $sessionStorage.$reset();
        $window.location.reload(true)
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
        console.log($sessionStorage.active, $scope.session);
      }
      else {
        $scope.session = true;
        console.log($sessionStorage.active, $scope.session);
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
  console.log(pw.length);
  return pw.length > 5;
}
