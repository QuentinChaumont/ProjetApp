'use strict';
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

// Connection URL
var url = 'mongodb://127.0.0.1:27017/SeekFriend';

var util = require('util');


module.exports = {
  postUsers,
  postLogin,
  getUsersUsername,
  putUsersUsername,
  deleteUsersUsername,
  getUsersFriends,
  postUsersFriends,
  getUsersFriendsRequest,
  postUsersFriendsRequest,
  getUsersFriendsUser,
  deleteUsersFriendsUser,
}
//utilisé les $set

// POST users
function postUsers(req, res, next) {
    MongoClient.connect(url,  function(err, db1) {
        assert.equal(null, err);
        db1.collection("users").findOne({"username": req.body.username},function(error, exist) {
            if(exist == null && error == null){
                var data = req.body;
                data.friends = [];
                data.friendsRequest = [];
                data.positions = [];
                db1.collection("users").insert(data,function(err, probe) {
                        if (!err){
							                  res.status(201).send();
                            // req.session.username = req.body.username;
                            // req.session.lastname = req.body.lastname;
                            // req.session.firstname = req.body.firstname;
                            // res.redirect('/api/users/' + req.body.username);
                        }
                        else{
                            res.status(409).send();
                        }
                    }
                );
            }
            else{
                res.status(409).send();
            }
        });
    });
}
function postLogin(req, res, next) {
  MongoClient.connect(url,  function(err, db1) {
    assert.equal(null, err);
    db1.collection("users").findOne({"username": req.body.username,"password":req.body.password},function(error, exist){
        if(exist != null && error == null) {
            delete(exist.password);
            res.status(201).json(exist);
        }
        else {
            res.status(409).send();
        }
    });
  });
}


// GET /users/{username}
function getUsersUsername(req, res, next) {
    MongoClient.connect(url,  function(err, db1) {
        assert.equal(null, err);
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

// /PUT  /users/{username}
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
                        if (req.body.password) use.password = req.body.password;

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


function deleteUsersUsername(req, res, next) {
    MongoClient.connect(url,  function(err, db1) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        db1.collection("users").findOne({"username": req.swagger.params.username.value},function(error, exist) {
            if(exist != null && error == null){
                db1.collection("users").remove( { "username": req.swagger.params.username.value },function(err, val) {
                        if (!err) res.json({success: 1, description: "Users ajouté"});
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


function getUsersFriends(req, res, next) {
    MongoClient.connect(url,  function(err, db1) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        db1.collection("users").findOne({"username": req.swagger.params.username.value},function(error, use) {
            if(use != null && error == null){
                res.json(use.devices);
            }
            else{
                res.status(409).send();
            }
        });

    });
}
function postUsersFriends(req, res, next) {
}

function getUsersFriendsRequest(req, res, next) {
    MongoClient.connect(url,  function(err, db1) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        db1.collection("users").findOne({"username": req.swagger.params.username.value},function(error, use) {
            if(use != null && error == null){
                res.json(use.devices);
            }
            else{
                res.status(409).send();
            }
        });

    });
}



function postUsersFriendsRequest(req, res, next) {
    MongoClient.connect(url,  function(err, db1) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        db1.collection("users").findOne({"username": req.swagger.params.username.value},function(error, user) {
            if(user != null && error == null && !(req.body.username in user.friends) && !(req.body.username in user.friendsRequest) ){
              db1.collection("users").findOne({"username": req.body.username},function(error, user2) {
                console.log(user2.friendsRequest.find(function(element){return element.username == req.swagger.params.username.value}));
                  if(user2 != null && error == null && !user2.friendsRequest.find(function(element){return element.username == req.swagger.params.username.value})){
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
    });
}

function getUsersFriendsUser(req, res, next) {
    MongoClient.connect(url,  function(err, db1) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        db1.collection("users").findOne({"username": req.swagger.params.username.value},function(error, use) {
            if(use != null && use.devices[req.swagger.params.uuid.value] != null && error == null){
                res.json(use.devices[req.swagger.params.uuid.value]);
            }
            else{
                res.status(404).send();
            }
        });
    });
}

function deleteUsersFriendsUser(req, res, next) {
    MongoClient.connect(url,  function(err, db1) {
        assert.equal(null, err);
        console.log("Connected correctly to server");

        db1.collection("users").findOne({"username": req.swagger.params.username.value},function(error,use) {
            if(use != null && use.devices[req.swagger.params.uuid.value] != null && error == null){
                delete(use.devices[req.swagger.params.uuid.value]);
                const device = { "$set" : {"devices" : use.devices}};
                db1.collection("users").update({"username" : req.swagger.params.username.value},  device,  function(err2, modif){
                    if (!err2) res.json({success: 1, description: "Users modifié"});
                    else{
                        console.log("1");
                        res.status(400).send();
                    }
                });
            }
            else res.status(404).send();
        });

    });
}
