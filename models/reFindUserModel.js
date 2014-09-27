var mongoose = require('mongoose');

var reFindUserSchema = new mongoose.Schema({
	gender             : String,
	id                 : Number,
	genderPrefOpposite : Boolean,
	single             : Boolean,
	events             : Array,
	latitude           : Number,
	longitude          : Number,
	timestamp          : Number
});

var reFindUserModel = module.exports = mongoose.model('reFindUser' , reFindUserSchema)