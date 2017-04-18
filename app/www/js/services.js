angular.module('starter.services', ['ngResource'])
/*
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
*/

// Source : https://www.sitepoint.com/premium/books/angularjs-novice-to-ninja/preview/understanding-angularjs-resource-e0638c0
//TODO changer l'adresse host 127.0.0.1 avec une variable pour pas avoir à tout retaper
.factory('Users', function($resource) {
  return $resource('http://127.0.0.1:3000/api/users');
})

.factory('User', function($resource) {
  return $resource('http://127.0.0.1:3000/api/users/:username');
})

.factory('Friend', function($resource) {
  return $resource('http://127.0.0.1:3000/api/users/:username/friends/:friend');
})

.factory('Friends', function($resource) {
  return $resource('http://127.0.0.1:3000/api/users/:username/friends');
})

.factory('FriendsRequest', function($resource) {
  return $resource('http://127.0.0.1:3000/api/users/:username/friendsRequest');
})

.factory('FriendPosition', function($resource) {
  return $resource('http://127.0.0.1:3000/api/users/:username/friends/:friend/positions');
})





