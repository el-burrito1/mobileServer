var mongoose = require('mongoose');

var locationSchema = new mongoose.Schema({
	gender             : String,
	_id                : Number,
	genderPrefOpposite : Boolean,
	single             : Boolean,
	events             :[String],
	groups             :[String],
	latitude           : Number,
	longitude          : Number,
	timestamp          : Number
});

var locationModel = module.exports = mongoose.model('location' , locationSchema)