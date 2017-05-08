'use strict';
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
var jwt    = require('jsonwebtoken');
var config = require('../../config');
var md5 = require('md5');
// Connection URL
var url = 'mongodb://' + config.mongoHostname + ':' + config.mongoPort + '/SeekFriend';


var util = require('util');

var NBR_MAX_POSITION = 50;

module.exports = {
  //postUsers,
  //postLogin,
  getUsers,
  getUsersUsername,
  putUsersUsername,
  deleteUsersUsername,
  getUsersPositions,
  postUsersPositions,
  getUsersFriends,
  postUsersFriends,
  getUsersFriendsRequest,
  postUsersFriendsRequest,
  deleteUsersFriendsRequestUser,
  getUsersFriendsUser,
  deleteUsersFriendsUser,
  getUsersFriendsUserPositions
}

// GET /users/{username}/friendsRequest
function getUsers(req, res, next) {
  MongoClient.connect(url,  function(err, db1) {
      assert.equal(null, err);
      console.log("<<<<<<<<<<<Connected correctly to server");
      db1.collection("users").find({"username" : {$regex : req.swagger.params.username.value}},{_id:0, username:1}).toArray(function(err, items) {
        if (!err) res.json(items);
        else{
            res.status(400).send();
        }
      });
});
}
//utilisé les $set

// POST users
// function postUsers(req, res, next) {
//     MongoClient.connect(url,  function(err, db1) {
//         assert.equal(null, err);
//
//         console.log("Connected correctly to server");
//         db1.collection("users").findOne({$or:[{"username": req.body.username},{"email":req.body.email}]},function(error, exist) {
//           console.log(exist);
//             if(exist == null && error == null){
//                 var data = req.body;
//                 data.friends = [];
//                 data.friendsRequest = [];
//                 data.positions = [];
//                 db1.collection("users").insert(data,function(err, probe) {
//                         if (!err){
// 							                  res.status(201).send();
//                             // req.session.username = req.body.username;
//                             // req.session.lastname = req.body.lastname;
//                             // req.session.firstname = req.body.firstname;
//                             // res.redirect('/api/users/' + req.body.username);
//                         }
//                         else{
//                             res.status(409).send();
//                         }
//                     }
//                 );
//             }
//             else{
//                 res.status(409).send();
//             }
//         });
//     });
// }

// function postLogin(req, res, next) {
//   MongoClient.connect(url,  function(err, db1) {
//     assert.equal(null, err);
//
//     console.log("Connected correctly to server");
//     db1.collection("users").findOne({"username": req.body.username,"password":req.body.password},function(error, user){
//         if(user != null && error == null) {
//             delete(user.password);
//             var token = jwt.sign(user, config.secret, {expiresIn: 1440 // expires in 24 hours
//             });
//               res.json({
//                 success: true,
//                 message: 'Enjoy your token!',
//                 token: token
//               });
//         }
//         else {
//             res.status(409).send();
//         }
//     });
//   });
// }
//

// GET /users/{username}
function getUsersUsername(req, res, next) {
    MongoClient.connect(url,  function(err, db1) {
        assert.equal(null, err);

        console.log("Connected correctly to server");
        db1.collection("users").findOne({"username": req.swagger.params.username.value}, function (error, user) {
            if (user != null && error == null){
              delete(user.password)
              res.json(user);
                // res.render('gestion', {
                //     username: req.session.username,
                //     lastname: req.session.lastname,
                //     firstname: req.session.firstname,
                //     email: exist.email
                // });
            }
            else{
                res.status(404).send();
            }
        });

    });
}

// PUT  /users/{username}
function putUsersUsername(req, res, next) {
    MongoClient.connect(url,  function(err, db1) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        db1.collection("users").findOne({"username": req.body.username},function(error2, use2){
            if(use2 == null){
                db1.collection("users").findOne({"username": req.swagger.params.username.value},function(error, use) {
                    if(use != null && error == null){
                        if (req.body.username) use.username = req.body.username;
                        if (req.body.email) use.email = req.body.email;
                        if (req.body.password) use.password = md5(req.body.password);
                        if (req.body.ghostMode!=null) use.ghostMode = req.body.ghostMode;
                        console.log(req.body.ghostMode);
                        db1.collection("users").update({"username" : req.swagger.params.username.value}, use,  function(err2, modif){
                            if (!err2) res.status(204).send();
                            else{
                                res.status(400).send();
                            }
                        });
                    }
                    else{
                        res.status(404).send();
                    }
                });
            }
            else{
                res.status(409).send();
            }
        });
    });
}

// DELETE  /users/{username}
function deleteUsersUsername(req, res, next) {
    MongoClient.connect(url,  function(err, db1) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        db1.collection("users").findOne({"username": req.swagger.params.username.value},function(error, exist) {
            if(exist != null && error == null){
                db1.collection("users").remove( { "username": req.swagger.params.username.value },function(err, val) {
                        if (!err) res.json({success: 1, description: "User removed"});
                        else{
                            res.status(404).send();
                        }
                    }
                );
            }
            else{
                res.status(404).send();
            }
        });

    });
}

// GET /users/{username}/positions
function getUsersPositions(req, res, next) {
    MongoClient.connect(url,  function(err, db1) {
        //assert.equal(null, err);
        console.log("Get users positions");
        db1.collection("users").findOne({"username": req.swagger.params.username.value},function(error, use) {
            console.log("------->", use);
            if(use != null && error == null && use.positions != null){
                res.json(use.positions);
            }
            else{
                res.status(409).send();
            }
        });
    });
}

// POST /users/{username}/positions
function postUsersPositions(req, res, next) {
  MongoClient.connect(url,  function(err, db1) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      db1.collection("users").findOne({"username": req.swagger.params.username.value},function(error, user) {
          if(user != null && error == null ){
            var posit = req.body;
            posit.date = new Date();
            console.log(posit);
            const position = { "$push" : {"positions" : posit}};
              db1.collection("users").update({"username" : req.swagger.params.username.value},  position,  function(err2, modif){
                if (!err2) {
                  if (user.positions.length > NBR_MAX_POSITION) {
                    console.log("suppr");
                    const suppr = { $pop: { "positions" : -1 } };
                    db1.collection("users").update({"username" : req.swagger.params.username.value},  suppr,  function(err3, sup){
                        if (!err2) {
                          res.status(201).send();
                        } else res.status(400).send();
                    });
                  } else res.status(201).send();
                } else res.status(400).send();
              });
            }
            else res.status(404).send();
      });
  });
}

// GET /users/{username}/friends
function getUsersFriends(req, res, next) {
    MongoClient.connect(url,  function(err, db1) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        db1.collection("users").findOne({"username": req.swagger.params.username.value},function(error, use) {
            if(use != null && error == null && use.friends != null){
                res.json(use.friends);
            }
            else{
                res.status(409).send();
            }
        });
    });
}

// POST /users/{username}/friends
function postUsersFriends(req, res, next) {
  MongoClient.connect(url,  function(err, db1) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      db1.collection("users").findOne({"username": req.swagger.params.username.value},function(error, user) {
          if(user != null && error == null &&  !user.friends.find(function(element){return element.username == req.body.username}) && user.friendsRequest.find(function(element){return element.username == req.body.username})){
            const friend = { "$push" : {"friends" : {"username" : req.swagger.params.username.value}}};
            const friend2 = { "$push" : {"friends" : {"username" : req.body.username}}};
            const suppr = { "$pull" : {"friendsRequest" : {"username" : req.body.username}}};
              db1.collection("users").update({"username" : req.body.username},  friend,  function(err2, modif){
                if (!err2) {
                  db1.collection("users").update({"username" : req.swagger.params.username.value},  friend2,  function(err2, modif){
                    if (!err2) {
                      db1.collection("users").update({"username" : req.swagger.params.username.value},  suppr,  function(err2, modif){
                        if (!err2) {
                             res.status(201).send(); //mettre un status 201 ici
                        } else res.status(400).send();
                      }); //mettre un status 201 ici
                    } else res.status(400).send();
                  }); //mettre un status 201 ici
                } else res.status(400).send();
              });
            }
            else res.status(404).send();
      });
  });
}


// GET /users/{username}/friendsRequest
function getUsersFriendsRequest(req, res, next) {
    MongoClient.connect(url,  function(err, db1) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        db1.collection("users").findOne({"username": req.swagger.params.username.value},function(error, use) {
            if(use != null && error == null && use.friendsRequest != null){
                res.json(use.friendsRequest);
            }
            else{
                res.status(409).send();
            }
        });
    });
}

// POST /users/{username}/friendsRequest
function postUsersFriendsRequest(req, res, next) {
    MongoClient.connect(url,  function(err, db1) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        if (req.swagger.params.username.value != req.body.username) {
        db1.collection("users").findOne({"username": req.swagger.params.username.value},function(error, user) {
            if(user != null && error == null &&  !user.friends.find(function(element){return element.username == req.body.username}) && !user.friendsRequest.find(function(element){return element.username == req.body.username})){
              db1.collection("users").findOne({"username": req.body.username},function(error, user2) {
                  if(user2 != null && error == null &&  !user2.friends.find(function(element){return element.username == req.swagger.params.username.value}) && !user2.friendsRequest.find(function(element){return element.username == req.swagger.params.username.value})){
                    const friend = { "$push" : {"friendsRequest" : {"username" : req.swagger.params.username.value}}};
                    db1.collection("users").update({"username" : req.body.username},  friend,  function(err2, modif){
                        if (!err2) {
    						           res.status(201).send(); //mettre un status 201 ici
					              } else
                        res.status(400).send();
                    });
                  }
                  else res.status(404).send();
                });
            }
            else{
                console.log("2");
                res.status(404).send();
            }
        });
      }
      else {

        res.status(400).send();
      }
    });
}

// DELETE /users/{username}/friendsRequest/{friendusername}
function deleteUsersFriendsRequestUser(req, res, next) {
    MongoClient.connect(url,  function(err, db1) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        db1.collection("users").findOne({"username": req.swagger.params.username.value},function(error,user) {
            if (user != null && error == null && user.friendsRequest.find(function (element) {return element.username == req.swagger.params.friendusername.value})) {
                const suppr = { "$pull" : {"friendsRequest" : {"username" : req.swagger.params.friendusername.value}}};
                db1.collection("users").update({"username" : req.swagger.params.username.value},  suppr,  function(err2, modif) {
                    if (!err2) {
                        res.status(204).send();
                    } else res.status(404).send();
                });
            }
            else res.status(404).send();
        });
    });
}

// GET /users/{username}/friends/{friendusername}
function getUsersFriendsUser(req, res, next) {
    MongoClient.connect(url,  function(err, db1) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        db1.collection("users").findOne({"username": req.swagger.params.username.value, },function(error, use) {
            if(use != null && error == null && use.friends.find(function(element){return element.username == req.swagger.params.friendusername.value})){
                db1.collection("users").findOne({"username": req.swagger.params.friendusername.value, },function(error, user) {
                  if(use != null && error == null){
                    delete(user.password);
                    res.json(user);
                  }
                  else res.status(404).send();
                });
            }
            else{
                res.status(404).send();
            }
        });
    });
}

// DELETE /users/{username}/friends/{friendusername}
function deleteUsersFriendsUser(req, res, next) {
    MongoClient.connect(url,  function(err, db1) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        db1.collection("users").findOne({"username": req.swagger.params.username.value},function(error,use) {
            if(use != null && error == null && use.friends.find(function(element){return element.username == req.swagger.params.friendusername.value})){
                const suppr = { "$pull" : {"friends" : {"username" : req.swagger.params.friendusername.value}}};
                db1.collection("users").update({"username" : req.swagger.params.username.value},  suppr,  function(err2, modif){
                    if (!err2){
                      db1.collection("users").findOne({"username": req.swagger.params.friendusername.value},function(error,use) {
                          if(use != null && error == null && use.friends.find(function(element){return element.username == req.swagger.params.username.value})){
                              const suppr = { "$pull" : {"friends" : {"username" : req.swagger.params.username.value}}};
                              db1.collection("users").update({"username" : req.swagger.params.friendusername.value},  suppr,  function(err2, modif){
                                  if (!err2) res.status(204).send();
                                  else res.status(404).send();
                              });
                          }
                          else res.status(404).send();
                      });
                    }
                    else res.status(404).send();
                });
            }
            else res.status(404).send();
        });
    });
}

// GET /users/{username}/friends/{friendusername}/positions
function getUsersFriendsUserPositions(req, res, next) {
    MongoClient.connect(url,  function(err, db1) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        db1.collection("users").findOne({"username": req.swagger.params.username.value },function(error, use) {
            if(use != null && error == null && use.friends.find(function(element){return element.username == req.swagger.params.friendusername.value})){
              console.log(use);
                db1.collection("users").findOne({"username": req.swagger.params.friendusername.value},function(error, user) {
                  console.log('<<<<<<<<<<<',user);
                  if(user != null && error == null){
                    res.json(user.positions);
                  }


                  else res.status(404).send();

                });
            }
            else{

              res.status(404).send();
            }
        });
    });
}
