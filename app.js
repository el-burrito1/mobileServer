
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var reFindUserModel = require('./models/reFindUserModel');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

if(global.process.env.MONGOHQ_URL){
  mongoose.connect(global.process.env.MONGOHQ_URL);
}else{
mongoose.connect('mongodb://localhost/reFindUsers');
}


var app = express();

app.configure(function(){
	app.use(express.cookieParser());
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


app.get('/createuser' , function (req , res){
	console.log(req.query);

	res.jsonp('user has been created');

	var date = new Date();
	var time = date.getTime();

	var reFindUser = new reFindUserModel({
		gender             : req.query.gender,
		id                 : req.query.ID,
		genderPrefOpposite : true,
		single             : true,
		events             : req.query.events,
		latitude           : req.query.latitude,
		longitude          : req.query.longitude,
		timestamp          : time
	});
	reFindUser.save(function(err,doc){
		res.send(doc);
		console.log(doc)
		console.log(err);
	});
});

app.get('/updateuser' , function (req , res){
	console.log(req.query);

	var date = new Date();
	var time = date.getTime();

	reFindUserModel.findOneAndUpdate({id : req.query.ID} , {$set:{
		latitude  : req.query.latitude,
		longitude : req.query.longitude,
		events    : req.query.events,
		timestamp : time
	}},function(err,doc){
		res.jsonp(doc)
		console.log(err)
	})
});

app.get('/updaterelationship' , function (req,res){
	console.log(req.query)

	reFindUserModel.update({id:req.query.ID} , {$set:{single:req.query.status}} , function(err,doc){
		console.log(err)
		res.jsonp(doc)
	})
})

app.get('/updatepreference' , function (req,res){
	console.log(req.query)

	reFindUserModel.update({id:req.query.ID} , {$set:{genderPrefOpposite:req.query.preferenceOpposite}} , function(err,doc){
		console.log(err)
		res.jsonp(doc)
	})
})

app.get('/readall' , function (req,res){
	reFindUserModel.find({}).find(function(err,docs){
		console.log(err)
		res.jsonp(docs)
	})
})

app.get('/readsingles' , function (req,res){
	console.log(req.query)
	var genderQuery
	var preferenceOpposite

	if(req.query.gender == 'male'){
		if(req.query.preferenceOpposite == 'true'){genderQuery='female'}else{genderQuery='male'}
	} else if (req.query.gender == 'female'){
		if(req.query.preferenceOpposite == 'true'){genderQuery='male'}else{genderQuery='female'}
	}

	if(req.query.preferenceOpposite == 'true'){preferenceOpposite=true}else{preferenceOpposite=false}

	reFindUserModel.find({gender:genderQuery,genderPrefOpposite:preferenceOpposite,single:true}).find(function(err,docs){
		console.log(err)
		res.jsonp(docs)
	})
})

app.get('/readcouples' , function (req,res){
	console.log(req.query)
	var genderQuery
	var preferenceOpposite

	if(req.query.gender == 'male'){
		if(req.query.preferenceOpposite == 'true'){genderQuery='female'}else{genderQuery='male'}
	} else if (req.query.gender == 'female'){
		if(req.query.preferenceOpposite == 'true'){genderQuery='male'}else{genderQuery='female'}
	}

	if(req.query.preferenceOpposite == 'true'){preferenceOpposite=true}else{preferenceOpposite=false}

	reFindUserModel.find({gender:genderQuery,genderPrefOpposite:preferenceOpposite,single:false}).find(function(err,docs){
		console.log(err)
		res.jsonp(docs)
	})	
})

app.get('/readevents' , function (req,res){
	console.log(req.query)

	reFindUserModel.find({events:req.query.events}).find(function(err,docs){
		console.log(err)
		res.jsonp(docs)
	})
})




http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
