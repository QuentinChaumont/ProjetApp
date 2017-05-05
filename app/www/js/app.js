// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','jett.ionic.filter.bar','ngStorage'])


.run(function($ionicPlatform, Resources,$sessionStorage, $window) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  if ($sessionStorage.username) {

  var survId = navigator.geolocation.watchPosition(function (pos) {
    console.log("mise a jour de la position");
    Resources.userPosition.save({username: $sessionStorage.username, token: $sessionStorage.token},{lat: pos.coords.latitude, lng: pos.coords.longitude});
  });
}
})



.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    templateUrl: 'templates/tabs.html',
    controller: 'TabsCtrl'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/home.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.map', {
    url: '/map',
    views: {
      'tab-map': {
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl'
      }
    }
  })

  .state('tab.friend', {
    url: '/friend',
    views: {
      'tab-friend': {
        templateUrl: 'templates/friend.html',
        controller: 'FriendCtrl'
      }
    }
  })
  .state('tab.login', {
      url: '/login',
      views: {
        'tab-home': {
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    }
  }
})
.state('tab.signUp', {
    url: '/signUp',
    views: {
      'tab-home': {
    templateUrl: 'templates/signUp.html',
    controller: 'SignUpCtrl'
  }
}
})

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});
