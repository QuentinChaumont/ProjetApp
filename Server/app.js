'use strict';

var config2 = {
	appRoot: __dirname // required config2
};

try {
	process.chdir(config2.appRoot); //on se place au bon endroit pour executer le processus
}
catch (err) {
	console.log('chdir: ' + err);
}


var SwaggerExpress = require('swagger-express-mw');
var session = require('express-session');
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var methodOverride = require('method-override');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var request = require('request');
var jwt = require('jsonwebtoken');
var md5 = require('md5');
var express = require('express')
    , http = require('http')
    , app = express()
    , server = http.createServer(app);
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var MongoClient = require('mongodb').MongoClient, assert = require('assert');

var config = require('./config');
var url = 'mongodb://' + config.mongoHostname + ':' + config.mongoPort + '/SeekFriend';


module.exports = app; // for testing
var apiRouter = express.Router();


/* On utilise les sessions */
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.set('view engine', 'ejs');
//app.set('superSecret', config.secret);

app.use(express.static(__dirname));
app.use(methodOverride('_method'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// ############ROUTE /api/users/login LOGIN#################

// Route Login hors du Swagger car sinon il est bloqué par le token d'authentification.


apiRouter.post('/users', function (req, res, next) {
	    MongoClient.connect(url,  function(err, db1) {
	      assert.equal(null, err);
	      console.log("Connected correctly to server");
	      db1.collection("users").findOne({$or:[{"username": req.body.username},{"email":req.body.email}]},function(error, user) {
	        console.log(user);
	          if(user == null && error == null){
	                var data = req.body;
									data.password=md5(data.password);
									data.ghostMode = true;
	                data.friends = [];
	                data.friendsRequest = [];
	                data.positions = [];
	                db1.collection("users").insert(data,function(err, probe) {
	                        if (!err){
														var token = jwt.sign(data, config.secret, {});
														console.log("Post/users ??");
														res.json({
															success: 200,
															message: 'Enjoy your token!',
															token: token
														});
	                        }
	                        else{
	                            res.status(409).send();
	                        }
	                    });
	            }
	            else{
	                res.status(409).send();
	            }
	        });
	    });
	});

apiRouter.post('/users/login', function (req, res, next) {
	MongoClient.connect(url,  function(err, db1) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    db1.collection("users").findOne({"username": req.body.username,"password":md5(req.body.password)},function(error, user){
        if(user != null && error == null) {
            var token = jwt.sign(user, config.secret, {});
              res.json({
                success: true,
                message: 'Enjoy your token!',
                token: token
              });
        }
        else {
            res.status(409).send();
        }
    });
  });

});


app.use('/api', apiRouter);

// app.use(function(req, res, next) {
//
//   // check header or url parameters or post parameters for token
//   var token = req.body.token || req.query.token || req.headers['x-access-token'];
//   // decode token
//   if (token) {
//     // verifies secret and checks exp
//     jwt.verify(token, config.secret, function(err, decoded) {
//       if (err) {
// 				console.log("Fail token  -- > Error de décryptage");
//         return res.json({ success: false, message: 'TimeOut' });
//       } else {
//         // if everything is good, save to request for use in other routes
//         req.decoded = decoded;
//         next();
//       }
//     });
//
//   } else {
//     // if there is no token
//     // return an error
// 		console.log("pas de token");
//     return res.status(403).send({
//         success: false,
//         message: 'No token provided.'
//     });
//
//   }
// });

SwaggerExpress.create(config2, function(err, swaggerExpress) {

    if (err) { throw err; }

    // install middleware
    swaggerExpress.register(app);
    console.log("serveur bien lancé");
    server.listen(80);
});
