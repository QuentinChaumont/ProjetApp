angular.module('starter.controllers', [])

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

.controller('AccountCtrl', function($scope, User, Users) {
  $scope.settings = {
    enableFriends: true
  };

  // juste des petits tests pur vérifier si tout marche bien
  $scope.username = 'hello';
  $scope.user = User.get({username: $scope.username}, function() {
    // everything went fine
    $scope.retrieved = true;
  }, function() {
    // error, create it
    Users.save({username: 'hello', email: 'hello@gmail.com', password: 'hello123'});
    $scope.retrieved = 'Nope, user hello created, please refresh'
  });
});
