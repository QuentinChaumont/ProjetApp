angular.module('starter.controllers', ['ionic','jett.ionic.filter.bar'])

  .controller('DashCtrl',  function($scope, $ionicFilterBar) {
    $scope.search = "udazudzauid";
    $scope.places = [{name: 'New York'}, {name: 'London'}, {name: 'Milan'}, {name: 'Paris'}];

    $scope.showFilterBar = function () {
      var filterBarInstance = $ionicFilterBar.show({
        cancelText: "Cancel",
        items: $scope.places,
        update: function (filteredItems, filterText) {
          $scope.places = filteredItems;
        }
      });
    };
  })


  .controller('MapCtrl', function($scope, $ionicLoading, $location, $anchorScroll, Resources) {
    $scope.map_available = true;
    $scope.position = false;
    $scope.filtre_rayon = 50;


    $scope.change = function() {
      $location.hash('selector_range');
      $anchorScroll();
    };
    //Pour la carte google map et la localisation
    var Enseirb_position = new google.maps.LatLng(44.8066376, -0.6073554);

    // Option pour la carte
    var mapOptions = {
      center: Enseirb_position,
      disableDefaultUI: true,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: true
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

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
    var list_friend = [
      {id: 1, name: "Thibaud", lat: 44.8076376, lng: -0.6073554},
      {id: 2, name: "Quentin", lat: 44.8086376, lng: -0.6073554},
      {id: 3, name: "Pad", lat: 44.8096376, lng: -0.6073554},
      {id: 4, name: "test", lat: 43.494555, lng: 4.979117}
    ];

    // -----------------------------------------------------------------------

    // Permet de recuperer la géolocalisation
    navigator.geolocation.watchPosition(function (pos) {
      $scope.position  = true;
      map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

      //Ajouter un marker
      var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

      var myLocation = new google.maps.Marker({
        position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
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

      var location, distance;
      if (list_friend[0] != undefined) {

        // On ajoute les distances avec les différents utilisateur
        angular.forEach(list_friend, function (value, key) {
          list_friend[key].distance = calcul_distance(value,pos.coords);
        });

        // On trie selon la distance
        list_friend.sort(function (a, b) {
          return a.distance - b.distance;
        });

        angular.forEach(list_friend, function (value, key) {
          addMarker(map, value);
        });
        $scope.list_friend = list_friend;
        $scope.$apply();
      }
    });

  })

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

  .controller('FriendCtrl', function($rootScope, $scope, Resources) {
    $scope.futureFriend = {};

    $rootScope.username = "hello";

    $scope.friends = Resources.friends.query({username: $rootScope.username});
    $scope.friendsRequest = Resources.friendsRequest.query({username: $rootScope.username});

    //TODO modifier cette fonction pour qu'elle soit accessible dans tous les controlleurs et updatable
    $scope.isConnected = function() {
      if ($rootScope.username != undefined) {
        return true;
      } else {
        return false;
      }
    };

    $scope.delete = function(friend) {
      Resources.friend.remove({username: $rootScope.username}, friend);
    };

    $scope.acceptRequest = function(friend) {
      Resources.friends.save({username: $rootScope.username}, friend);
    };

    $scope.declineRequest = function(friend) {
      //TODO à debug : ne marche pas, pourtant coté serveur ça fonctionne (tests réalisés sous swagger)
      Resources.friendsRequest.remove({username: $rootScope.username}, friend);
    };

    $scope.addRequest = function() {
      // POST request in the future friend database
      Resources.friendsRequest.save({username: $scope.futureFriend.username}, {username: $rootScope.username},
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
  })

  .controller('AccountCtrl', function($scope, $rootScope, Resources) {
    $scope.settings = {
      enableFriends: true
    };

    //TODO modifier cette fonction pour qu'elle soit accessible dans tous les controlleurs et updatable
    $scope.isConnected = function() {
      if ($rootScope.username != undefined) {
        return true;
      } else {
        return false;
      }
    }

    $scope.user = Resources.user.get({username: $rootScope.username});
  });

// Adds a marker to the map.
function addMarker(map,info_friend){
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(info_friend.lat, info_friend.lng),
    label: "" + info_friend.id,
    map: map,
    title : "Location of " + info_friend.name
  });

  // Faire quelque chose lorsque l'on appuie sur un marker
  var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h1 id="firstHeading" class="firstHeading">'+ info_friend.name +'</h1>'+
    '<div id="bodyContent">'+
    '<p><b>' + info_friend.name + '</b> est a une distance de : ' +
    info_friend.distance +
    '</div>'+
    '</div>';

  var fenetre = new google.maps.InfoWindow({
    content: contentString
  });

  marker.addListener('click', function() {
    fenetre.open(map, marker);
    console.log("c'est le marker : " + marker.getLabel());
  });
}

function calcul_distance(pos1,pos2){
  var R = 6378137;
  var dLat = (pos1.lat-pos2.latitude) * Math.PI / 180;
  var dLon = (pos1.lng-pos2.longitude) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(pos1.lat * Math.PI / 180 ) * Math.cos(pos2.latitude * Math.PI / 180 ) *
    Math.sin(dLon/2) * Math.sin(dLon/2);

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var distance = Math.round(R * c);
  return distance;
};
