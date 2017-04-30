angular.module('starter.services', ['ngResource'])

  // defines all routes
  .factory('Resources', function($resource) {
    var hostname = 'http://127.0.0.1:3000';
    return {
      login: $resource(hostname.concat('/api/login')),
      users: $resource(hostname.concat('/api/users')),
      user: $resource(hostname.concat('/api/users/:username'),
        {
        'update': { method:'PUT' } //create custom PUT request : https://docs.angularjs.org/api/ngResource/service/$resource
      }),
      friend: $resource(hostname.concat('/api/users/:username/friends/:friend')),
      friends: $resource(hostname.concat('/api/users/:username/friends')),
      friendsRequest: $resource(hostname.concat('/api/users/:username/friendsRequest')),
      friendsPosition: $resource(hostname.concat('/api/users/:username/friends/:friend/positions'))
    };
  })

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



