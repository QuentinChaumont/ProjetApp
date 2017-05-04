angular.module('starter.services', ['ngResource'])

  // defines all routes
  .factory('Resources', function($resource) {
    var hostname = 'http://127.0.0.1:3000';
    return {
      login: $resource(hostname.concat('/api/users/login')),
      users: $resource(hostname.concat('/api/users')),
      user: $resource(hostname.concat('/api/users/:username'),null,
        {
        'update': { method:'PUT' } //create custom PUT request : https://docs.angularjs.org/api/ngResource/service/$resource
      }),
      userPosition: $resource(hostname.concat('/api/users/:username/positions')),
      friend: $resource(hostname.concat('/api/users/:username/friends/:friend')),
      friends: $resource(hostname.concat('/api/users/:username/friends')),
      friendsRequest: $resource(hostname.concat('/api/users/:username/friendsRequest')),
      friendsRequestUser: $resource(hostname.concat('/api/users/:username/friendsRequest/:friendusername')),
      friendPosition: $resource(hostname.concat('/api/users/:username/friends/:friendusername/positions'))
    };
  })

  .service('LoginService', function($q, $http, Resources) {
      return {
          loginUser: function(name, pw) {
              var deferred = $q.defer();
              var promise = deferred.promise;
              var success = false;
              var body = {username: name, password: pw}
              var user = Resources.login.save(body, function() {
               // everything went fine
               deferred.resolve('Welcome ' + name + '!');
              }, function() {
                // error, create it
                //console.log(Resources.users.save({username: 'hello', email: 'hello@gmail.com', password: 'hello123'}));
                deferred.reject('Wrong credentials.');
              });
              console.log(user);

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

  .service('SignUpService', function($q, $http, Resources) {
      return {
          signUpUser: function(name, mail, pw) {
              var deferred = $q.defer();
              var promise = deferred.promise;
              var success = false;
              var body = {username: name, email: mail, password: pw}
              var user = Resources.users.save(body, function() {
               // everything went fine
               deferred.resolve('Welcome ' + name + '!');
              }, function() {
                // error, create it
                //console.log(Resources.users.save({username: 'hello', email: 'hello@gmail.com', password: 'hello123'}));
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

  .service('PasswordService', function($q, $http, Resources) {
      return {
          changePassword: function(name,actualpw,pw) {
              var deferred = $q.defer();
              var promise = deferred.promise;
              var success = false;
              var body = {username: name, password: actualpw}
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
              console.log(user);

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
