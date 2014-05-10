
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var locationModel = require('./models/locationModel');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// var passport = require('passport')
//   , FacebookStrategy = require('passport-facebook').Strategy;

//   passport.use(new FacebookStrategy({
//       clientID: 443530475777959,
//       clientSecret: '87fddfd694ebea4b4ac008b9e78c309e',
//       callbackURL: "http://127.0.0.1:3000/"
//     },
//     function(accessToken, refreshToken, profile, done) {
//       User.findOrCreate(function(err, user) {
//         if (err) { return done(err); }
//         done(null, user);
//       });
//     }
//   ));


mongoose.connect('mongodb://localhost/locations');

var app = express();

app.configure(function(){
	app.use(express.cookieParser());
	// app.use(express.session({ secret: 'keyboard cat' }));
	// app.use(passport.initialize());
	// app.use(passport.session());
})

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set("jsonp callback", true);
app.use(express.bodyParser());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.multipart())
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/' , function (req , res){
	res.render('index');
});


app.get('/inituser' , function (req , res){
	console.log(req.query);
	var all     = []; 
	var single  = [];
	var couples = [];

	function People(all,single,couples){
		this.all     = all,
		this.single  = single,
		this.couples = couples
	};

	if(req.query.userGender === 'male'){
		locationModel.find({gender : 'female'} , function(err, docs){
			all.push(docs);
			console.log(err);
		});
		locationModel.find({gender : 'female' , single : true} , function(err,docs){
			single.push(docs);
			console.log(err);
		});
		locationModel.find({gender : 'female' , single : false} , function(err,docs){
			couples.push(docs);
			console.log(err);
		})
	} else {
		locationModel.find({gender : 'male'} , function(err, docs){
			all.push(docs);
			console.log(err);
		});
		locationModel.find({gender : 'male' , single : true} , function(err,docs){
			single.push(docs);
			console.log(err);
		});
		locationModel.find({gender : 'male' , single : false} , function(err,docs){
			couples.push(docs);
			console.log(err);
		})
	};

	var allPeople = new People(all,single,couples);

	console.log(allPeople);

	res.jsonp(allPeople);

	var thisDate = new Date();
	var thisTime = thisDate.getTime();

	var location = new locationModel({
		gender             : req.query.userGender,
		_id                : req.query._id,
		genderPrefOpposite : true,
		single             : true,
		events             : req.query.userEvents,
		latitude           : req.query.latitude,
		longitude          : req.query.longitude,
		timestamp          : thisTime
	});
	location.save(function(err,doc){
		res.send(doc);
		console.log(err);
	});
});

app.get('/updateuser' , function (req , res){
	console.log(req.query);

	var userInfo;
	var all     = []; 
	var single  = [];
	var couples = [];

	function People(all,single,couples){
		this.all     = all,
		this.single  = single,
		this.couples = couples
	};


	locationModel.find({_id : req.query._id} , function(err , doc){
		if(doc.gender === 'male' || doc.genderPrefOpposite === true){
		locationModel.find({gender : 'female' , genderPrefOpposite : true} , function(err, docs){
			all.push(docs);
			console.log(err);
		});
		locationModel.find({gender : 'female' , genderPrefOpposite : true , single : true} , function(err,docs){
			single.push(docs);
			console.log(err);
		});
		locationModel.find({gender : 'female' , genderPrefOpposite : true , single : false} , function(err,docs){
			couples.push(docs);
			console.log(err);
		});
	} else if (doc.gender === 'male' || doc.genderPrefOpposite === false){
		locationModel.find({gender : 'male' , genderPrefOpposite : false} , function(err, docs){
			all.push(docs);
			console.log(err);
		});
		locationModel.find({gender : 'male' , genderPrefOpposite : false , single : true} , function(err,docs){
			single.push(docs);
			console.log(err);
		});
		locationModel.find({gender : 'male' , genderPrefOpposite : false , single : false} , function(err,docs){
			couples.push(docs);
			console.log(err);
		});
	} else if (doc.gender === 'female' || doc.genderPrefOpposite === true){
		locationModel.find({gender : 'male' , genderPrefOpposite : true} , function(err, docs){
			all.push(docs);
			console.log(err);
		});
		locationModel.find({gender : 'male' , genderPrefOpposite : true , single : true} , function(err,docs){
			single.push(docs);
			console.log(err);
		});
		locationModel.find({gender : 'male' , genderPrefOpposite : true , single : false} , function(err,docs){
			couples.push(docs);
			console.log(err);
		});
	} else if (doc.gender === 'female' || doc.genderPrefOpposite === false){
			locationModel.find({gender : 'female' , genderPrefOpposite : false} , function(err, docs){
			all.push(docs);
			console.log(err);
		});
		locationModel.find({gender : 'female' , genderPrefOpposite : false , single : true} , function(err,docs){
			single.push(docs);
			console.log(err);
		});
		locationModel.find({gender : 'female' , genderPrefOpposite : false , single : false} , function(err,docs){
			couples.push(docs);
			console.log(err);
		});
	};

		var allPeople = new People(all,single,couples);

		res.jsonp({people : allPeople , currentUser : doc});
	});

	var thisDate = new Date();
	var thisTime = thisDate.getTime();

	var user   = {_id        : req.query._id};
	var update = { events    : req.query.userEvents,
				   latitude  : req.query.latitude,
				   longitude : req.query.longitude,
				   timestamp : thisTime};

   locationModel.update(user,update,{multi:true},function(err,numAffected){
   		console.log(numAffected);
   		console.log(err);
   });

});


///////////////USER UPDATES/////////////////////////////////////

app.get('/updateprefsame' , function (req,res){
		console.log(req.query);

		var all     = []; 
		var single  = [];
		var couples = [];

		function People(all,single,couples){
			this.all     = all,
			this.single  = single,
			this.couples = couples
		};

		locationModel.update({_id : req.query._id},{genderPrefOpposite: false} , {multi:false} , function(err , numAffected){
			console.log(numAffected);
			console.log(err);
		});

		if(req.query.userGender === 'male'){
			locationModel.find({gender : 'male' , genderPrefOpposite : false} , function(err,docs){
			    all.push(docs);
			    console.log(err);
			});
			locationModel.find({gender : 'male' , genderPrefOpposite: false , single : true} , function(err,docs){
				single.push(docs);
				console.log(err);
			});
			locationModel.find({gender : 'male' , genderPrefOpposite: false , single : false} , function(err,docs){
				couples.push(docs);
				console.log(err);
			})
		} else if (req.query.userGender === 'female'){
			locationModel.find({gender : 'female' , genderPrefOpposite : false} , function(err,docs){
			    all.push(docs);
			    console.log(err);
			});
			locationModel.find({gender : 'female' , genderPrefOpposite: false , single : true} , function(err,docs){
				single.push(docs);
				console.log(err);
			});
			locationModel.find({gender : 'female' , genderPrefOpposite: false , single : false} , function(err,docs){
				couples.push(docs);
				console.log(err);
			})
		} 

		var allPeople = new People(all,single,couples);
		res.jsonp({updatedPref : allPeople});
});



app.get('/updateprefopposite' , function (req,res){
		console.log(req.query);

		var all     = []; 
		var single  = [];
		var couples = [];

		function People(all,single,couples){
			this.all     = all,
			this.single  = single,
			this.couples = couples
		};

		locationModel.update({_id : req.query._id},{genderPrefOpposite: true} , {multi:false} , function(err , numAffected){
			console.log(numAffected);
			console.log(err);
		});

		if(req.query.userGender === 'male'){
			locationModel.find({gender : 'male' , genderPrefOpposite : true} , function(err,docs){
			    all.push(docs);
			    console.log(err);
			});
			locationModel.find({gender : 'male' , genderPrefOpposite: true , single : true} , function(err,docs){
				single.push(docs);
				console.log(err);
			});
			locationModel.find({gender : 'male' , genderPrefOpposite: true , single : false} , function(err,docs){
				couples.push(docs);
				console.log(err);
			})
		} else if (req.query.userGender === 'female'){
			locationModel.find({gender : 'female' , genderPrefOpposite : true} , function(err,docs){
			    all.push(docs);
			    console.log(err);
			});
			locationModel.find({gender : 'female' , genderPrefOpposite: true , single : true} , function(err,docs){
				single.push(docs);
				console.log(err);
			});
			locationModel.find({gender : 'female' , genderPrefOpposite: true , single : false} , function(err,docs){
				couples.push(docs);
				console.log(err);
			})
		} 

		var allPeople = new People(all,single,couples);
		res.jsonp({updatedPref : allPeople});


		res.jsonp('opposite updated!');
})

app.get('/updaterelationshipsingle' , function (req,res){
		console.log(req.query);
		locationModel.update({_id : req.query._id},{single: true} , {multi:false} , function(err , numAffected){
			console.log(numAffected);
			console.log(err);
		});
		res.jsonp('single updated!');
});

app.get('/updaterelationshipcouple' , function (req,res){
		console.log(req.query);
		locationModel.update({_id : req.query._id},{single: false} , {multi:false} , function(err , numAffected){
			console.log(numAffected);
			console.log(err);
		});
		res.jsonp('couple updated!');
});

///////////////END USER UPDATES/////////////////////////////////////





http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
