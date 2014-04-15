var mongoose = require('mongoose');

var locationSchema = new mongoose.Schema({
	latitude: Number,
	longitude: Number,
	timestamp: Number
});

var locationModel = module.exports = mongoose.model('location' , locationSchema)