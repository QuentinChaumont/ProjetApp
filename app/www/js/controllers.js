angular.module('starter.controllers', ['ionic'])

  .controller('DashCtrl', function($scope) {})

  .controller('MapCtrl', function($scope, $ionicLoading) {

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
    var list_friend = [
      {id: 1, name: "Thibaud", lat: 44.8076376, lng: -0.6073554},
      {id: 2, name: "Quentin", lat: 44.8086376, lng: -0.6073554},
      {id: 3, name: "Pad", lat: 44.8096376, lng: -0.6073554},
      {id: 4, name: "test", lat: 43.494555, lng: 4.979117}
    ];

    // -----------------------------------------------------------------------

    // Permet de recuperer la géolocalisation
    navigator.geolocation.getCurrentPosition(function (pos) {
      map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

      //Ajouter un marker
      var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
      var myLocation = new google.maps.Marker({
        position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
        map: map,
        icon: image,
        title: "My Location"
      });

      var location, distance;
      if (list_friend[0] != undefined) {

        // On ajoute les distances avec les différents utilisateur
        angular.forEach(list_friend, function (value, key) {
          /*
           distance = new google.maps.geometry.spherical.computeDistanceBetween(
           new google.maps.LatLng(value.lat, value.lng), pos.coords);
           */

          /* calcul distance a la main */
          var R = 6378137;
          var dLat = (value.lat-pos.coords.latitude) * Math.PI / 180;
          var dLon = (value.lng-pos.coords.longitude) * Math.PI / 180;
          var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(value.lat * Math.PI / 180 ) * Math.cos(pos.coords.latitude * Math.PI / 180 ) *
            Math.sin(dLon/2) * Math.sin(dLon/2);

          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          var distance = Math.round(R * c);
          list_friend[key].distance = distance;
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
    $scope.map = map;

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

  .controller('AccountCtrl', function($scope) {
    $scope.settings = {
      enableFriends: true
    };
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
