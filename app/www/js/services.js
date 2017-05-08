angular.module('starter.services', ['ngResource'])

.constant('Config', {
  apiUrl: 'http://127.0.0.1:3000/api'
})
  // defines all routes
  .factory('Resources', function($resource) {
      var apiUrl = 'http://tpriou.rmorpheus.enseirb.fr:80/api';
    return {
      login: $resource(apiUrl.concat('/users/login')),
      users: $resource(apiUrl.concat('/users')),
      user: $resource(apiUrl.concat('/users/:username'),null,
        {
        'update': { method:'PUT' } //create custom PUT request : https://docs.angularjs.org/api/ngResource/service/$resource
      }),

      userPosition: $resource(apiUrl.concat('/users/:username/positions')),
      friend: $resource(apiUrl.concat('/users/:username/friends/:friend')),
      friends: $resource(apiUrl.concat('/users/:username/friends')),
      friendsRequest: $resource(apiUrl.concat('/users/:username/friendsRequest')),
      friendsRequestUser: $resource(apiUrl.concat('/users/:username/friendsRequest/:friendusername')),
      friendPosition: $resource(apiUrl.concat('/users/:username/friends/:friendusername/positions')),
      listUsername: $resource(apiUrl.concat('/users/list/:username'))
  };
})
  .service('LoginService', function($q, $http, Resources,$sessionStorage) {
      return {
          loginUser: function(name, pw) {
              var deferred = $q.defer();
              var promise = deferred.promise;
              var success = false;
              var body = {username: name, password: pw}
              var user = Resources.login.save(body, function(test) {
               // everything went fine
               test.$promise.then(function(res){
                 $sessionStorage.token = res.token;
                 deferred.resolve("succès");
               }).catch(function(err){
                 console.log("Error : service.js : LoginService : Token");
                 throw err; // rethrow;
               });

              }, function() {
                // error, create it
                deferred.reject('Wrong credentials.');
              });
              promise.success = function(fn) {
                  promise.then(fn);
                  return promise;
              }
              promise.error = function(fn) {
                  promise.then(null, fn);
                  return promise;
              }
              return promise;
          }
      }
  })

  .service('SignUpService', function($q, $http, Resources, $sessionStorage) {
      return {
          signUpUser: function(name, mail, pw) {
              var deferred = $q.defer();
              var promise = deferred.promise;
              var success = false;
              var body = {username: name, email: mail, password: pw}
              var user = Resources.users.save(body, function(test) {
                test.$promise.then(function(res){
                  $sessionStorage.token = res.token;
                  deferred.resolve("succès");
                }).catch(function(err){
                  console.log("Error : service.js : LoginService : Token");
                  throw err; // rethrow;
                });
              }, function() {
                // error, create it
                deferred.reject('Wrong ids.');
              });
              promise.success = function(fn) {
                  promise.then(fn);
                  return promise;
              }
              promise.error = function(fn) {
                  promise.then(null, fn);
                  return promise;
              }
              return promise;
          }
      }
  })

  .service('PasswordService', function($q, $http, Resources, $sessionStorage) {
      return {
          changePassword: function(name,actualpw,pw) {
              var deferred = $q.defer();
              var promise = deferred.promise;
              var success = false;
              var body = {username: name, password: actualpw, token: $sessionStorage.token}
              var user = Resources.login.save(body, function() {
                  Resources.user.update(body,{password: pw}, function() {
                   // everything went fine
                   deferred.resolve('password changed');
                  }, function() {
                    // error, create it
                    //console.log(Resources.users.save({username: 'hello', email: 'hello@gmail.com', password: 'hello123'}));
                    deferred.reject('Wrong ids');
                  });
              }, function() {
                // error, create it
                //console.log(Resources.users.save({username: 'hello', email: 'hello@gmail.com', password: 'hello123'}));
                deferred.reject('Wrong ids');
              });
              promise.success = function(fn) {
                  promise.then(fn);
                  return promise;
              }
              promise.error = function(fn) {
                  promise.then(null, fn);
                  return promise;
              }
              return promise;
          }
      }
  })
  .service('GhostModeService', function($q, $http, Resources, $sessionStorage) {
      return {
          modeFantome: function(ghostMode) {
              var deferred = $q.defer();
              var promise = deferred.promise;
              var success = false;
              var body = {username: $sessionStorage.username, token: $sessionStorage.token}
              var user = Resources.user.update(body,{ghostMode: ghostMode}, function() {
                   // everything went fine
                   deferred.resolve('ghostmode changed');
                  }, function() {
                    // error, create it
                    //console.log(Resources.users.save({username: 'hello', email: 'hello@gmail.com', password: 'hello123'}));
                    deferred.reject('Wrong ids');
                  });

              promise.success = function(fn) {
                  promise.then(fn);
                  return promise;
              }
              promise.error = function(fn) {
                  promise.then(null, fn);
                  return promise;
              }
              return promise;
          }
      }
  })
